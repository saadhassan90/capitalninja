import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from "date-fns";
import { getChartColors } from "@/utils/chartColors";
import { fetchTransactionData } from "@/utils/transactionData";
import { formatYAxis, formatTooltipValue } from "@/utils/formatters";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium text-sm">{format(parseISO(label), 'yyyy')}</p>
        <p className="text-sm text-gray-600">
          Investment Volume: {formatTooltipValue(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

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
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                name="Total Investment"
                fill={colors[0]}
                radius={[8, 8, 0, 0]}
                barSize={32}
                onMouseEnter={(data, index) => {
                  document.querySelector(`#bar-${index}`)?.classList.add('animate-chart-hover');
                }}
                onMouseLeave={(data, index) => {
                  document.querySelector(`#bar-${index}`)?.classList.remove('animate-chart-hover');
                }}
              >
                {transactionsData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    id={`bar-${index}`}
                    fill={colors[0]}
                    className="origin-bottom transition-transform duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};