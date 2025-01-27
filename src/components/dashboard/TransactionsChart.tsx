import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from "date-fns";
import { getChartColors } from "@/utils/chartColors";

interface TransactionData {
  date: string;
  directInvestments: number;
  fundCommitments: number;
  total: number;
}

export const TransactionsChart = () => {
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions-timeline'],
    queryFn: async () => {
      // Fetch direct investments
      const { data: directInvestments } = await supabase
        .from('direct_investments')
        .select('deal_date, deal_size')
        .not('deal_date', 'is', null)
        .order('deal_date');

      // Log the raw direct investments data
      console.log('Raw Direct Investments:', directInvestments);

      // Fetch fund commitments
      const { data: fundCommitments } = await supabase
        .from('fund_commitments')
        .select('commitment_date, commitment')
        .not('commitment_date', 'is', null)
        .order('commitment_date');

      // Log the raw fund commitments data
      console.log('Raw Fund Commitments:', fundCommitments);

      // Combine and process the data
      const transactionsByDate = new Map<string, TransactionData>();

      directInvestments?.forEach(investment => {
        if (!investment.deal_date) return;
        const date = investment.deal_date;
        const existing = transactionsByDate.get(date) || {
          date,
          directInvestments: 0,
          fundCommitments: 0,
          total: 0
        };
        existing.directInvestments += investment.deal_size || 0;
        existing.total = existing.directInvestments + existing.fundCommitments;
        transactionsByDate.set(date, existing);
      });

      fundCommitments?.forEach(commitment => {
        if (!commitment.commitment_date) return;
        const date = commitment.commitment_date;
        const existing = transactionsByDate.get(date) || {
          date,
          directInvestments: 0,
          fundCommitments: 0,
          total: 0
        };
        existing.fundCommitments += commitment.commitment || 0;
        existing.total = existing.directInvestments + existing.fundCommitments;
        transactionsByDate.set(date, existing);
      });

      const sortedData = Array.from(transactionsByDate.values())
        .sort((a, b) => a.date.localeCompare(b.date));

      // Log the processed data
      console.log('Processed Data:', sortedData);
      console.log('Most recent transaction date:', sortedData[sortedData.length - 1]?.date);

      return sortedData;
    },
  });

  const formatYAxis = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const colors = getChartColors(3);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Transaction Volume Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={transactionsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatTooltipValue(value),
                  name.replace(/([A-Z])/g, ' $1').trim()
                ]}
                labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="directInvestments"
                name="Direct Investments"
                stroke={colors[0]}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="fundCommitments"
                name="Fund Commitments"
                stroke={colors[1]}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={colors[2]}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};