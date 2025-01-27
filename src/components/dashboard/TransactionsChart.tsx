import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from "date-fns";
import { getChartColors } from "@/utils/chartColors";
import { fetchTransactionData } from "@/utils/transactionData";
import { formatYAxis, formatTooltipValue } from "@/utils/formatters";

export const TransactionsChart = () => {
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions-timeline'],
    queryFn: async () => {
      const data = await fetchTransactionData();
      console.log('Raw transactions data:', data);
      if (data && data.length > 0) {
        console.log('First transaction date:', data[0].date);
        console.log('Last transaction date:', data[data.length - 1].date);
      }
      return data;
    },
  });

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