import { TooltipProps } from "recharts";

export const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium text-sm">{data.name}</p>
        <p className="text-sm text-gray-600">
          Invested: ${data.size}B
          <br />
          Share: {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};