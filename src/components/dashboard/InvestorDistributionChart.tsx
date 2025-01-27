import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Updated monochromatic purple color palette
const COLORS = [
  '#9b87f5', // Primary Purple
  '#7E69AB', // Secondary Purple
  '#6E59A5', // Tertiary Purple
  '#1A1F2C', // Dark Purple
  '#D6BCFA', // Light Purple
  '#E5DEFF', // Soft Purple
  '#8B5CF6', // Vivid Purple
  '#6E59A5'  // Additional Tertiary Purple
];

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
          Count: {payload[0].value}
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
    <Card>
      <CardHeader>
        <CardTitle>Investor Types Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div className="flex items-center justify-center h-full">
          <div className="w-[70%] h-full">
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
                >
                  {data?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
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
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: "500"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};