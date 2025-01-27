import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/utils/chartColors";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Count: {payload[0].value.toLocaleString()}
          <br />
          Percentage: {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

interface InvestorDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    total: number;
  }>;
}

export const InvestorDistributionChart = ({ data }: InvestorDistributionChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-medium">Investor Types</CardTitle>
        <p className="text-sm text-muted-foreground">Distribution by investor category</p>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
              cornerRadius={8}
              onMouseEnter={(data, index) => {
                document.querySelector(`#sector-${index}`)?.classList.add('animate-chart-hover');
              }}
              onMouseLeave={(data, index) => {
                document.querySelector(`#sector-${index}`)?.classList.remove('animate-chart-hover');
              }}
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  id={`sector-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                  className="origin-center transition-transform duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              wrapperStyle={{
                paddingLeft: "40px",
                fontSize: "12px",
                fontWeight: "500"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};