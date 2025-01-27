import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";

// Define specific colors for the heatmap
const HEATMAP_COLORS = [
  '#8ca6bd', // Light Blue Grey
  '#7199bc', // Medium Blue Grey
  '#5b7b98', // Blue Grey
  '#718597', // Grey Blue
  '#556573', // Dark Grey Blue
  '#465f75'  // Deep Grey Blue
] as const;

const CHART_DATA = {
  "name": "Asset Classes",
  "children": [
    {
      "name": "Private Equity (PE)",
      "size": 1150,
      "percentage": 30
    },
    {
      "name": "Venture Capital (VC)",
      "size": 600,
      "percentage": 15
    },
    {
      "name": "Real Estate (RE)",
      "size": 900,
      "percentage": 23
    },
    {
      "name": "Infrastructure",
      "size": 450,
      "percentage": 12
    },
    {
      "name": "Private Credit (PC)",
      "size": 700,
      "percentage": 18
    },
    {
      "name": "Energy",
      "size": 120,
      "percentage": 2
    }
  ]
};

const CustomTooltip = ({ active, payload }: any) => {
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

export const AssetClassHeatmap = () => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-medium">Asset Class Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Investment allocation across asset classes in 2024</p>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={CHART_DATA.children}
            dataKey="size"
            aspectRatio={1}
            stroke="#fff"
            fill="none"
          >
            {({ root }) => {
              if (!root) return null;
              
              return root.children?.map((node: any, index: number) => {
                const { x, y, width, height, name, percentage } = node;
                const color = HEATMAP_COLORS[index];
                
                return (
                  <g key={name}>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={color}
                      stroke="#fff"
                      strokeWidth={2}
                      className="transition-colors duration-200 hover:opacity-90"
                    />
                    {width > 60 && height > 40 && (
                      <>
                        <text
                          x={x + width / 2}
                          y={y + height / 2 - 8}
                          textAnchor="middle"
                          fill="white"
                          className="text-xs font-medium"
                        >
                          {name.split(' ')[0]}
                        </text>
                        <text
                          x={x + width / 2}
                          y={y + height / 2 + 8}
                          textAnchor="middle"
                          fill="white"
                          className="text-xs"
                        >
                          {percentage}%
                        </text>
                      </>
                    )}
                  </g>
                );
              });
            }}
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};