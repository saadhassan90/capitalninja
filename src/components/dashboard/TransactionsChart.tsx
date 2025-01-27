import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from "date-fns";
import { getChartColors } from "@/utils/chartColors";
import { fetchTransactionData } from "@/utils/transactionData";
import { formatYAxis, formatTooltipValue } from "@/utils/formatters";

export const TransactionsChart = () => {
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions-timeline'],
    queryFn: fetchTransactionData,
  });

  const colors = getChartColors(1);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Investment Volume Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                tickFormatter={(date) => format(parseISO(date), 'yyyy')}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => [
                  formatTooltipValue(value),
                  'Total Investment'
                ]}
                labelFormatter={(label) => format(parseISO(label), 'yyyy')}
              />
              <Bar
                dataKey="total"
                name="Total Investment"
                fill={colors[0]}
                radius={[8, 8, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};