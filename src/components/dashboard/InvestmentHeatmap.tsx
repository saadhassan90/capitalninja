import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#8ca6bd', '#7199bc', '#5b7b98', '#718597', '#556573', '#465f75'];

const data = {
  name: "Investment Distribution",
  children: [
    {
      name: "Private Equity (PE)",
      size: 1150,
      value: 1150,
      percentage: 30,
      color: COLORS[0]
    },
    {
      name: "Venture Capital (VC)",
      size: 600,
      value: 600,
      percentage: 15,
      color: COLORS[1]
    },
    {
      name: "Real Estate (RE)",
      size: 900,
      value: 900,
      percentage: 23,
      color: COLORS[2]
    },
    {
      name: "Infrastructure",
      size: 450,
      value: 450,
      percentage: 12,
      color: COLORS[3]
    },
    {
      name: "Private Credit (PC)",
      size: 700,
      value: 700,
      percentage: 18,
      color: COLORS[4]
    },
    {
      name: "Commodities",
      size: 120,
      value: 120,
      percentage: 3,
      color: COLORS[5]
    },
    {
      name: "Energy",
      size: 80,
      value: 80,
      percentage: 2,
      color: COLORS[5]
    }
  ]
};

interface CustomContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  percentage: number;
}

const CustomContent = ({ x, y, width, height, name, percentage }: CustomContentProps) => {
  const fontSize = Math.min(width / 16, height / 6);
  const shouldShowText = width > 60 && height > 40;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: data.children.find(item => item.name === name)?.color || COLORS[0],
          stroke: "#fff",
          strokeWidth: 2,
          cursor: "pointer",
          transformOrigin: `${x + width/2}px ${y + height/2}px`,
          transition: "transform 0.2s ease-out"
        }}
        className="hover:scale-[1.02]"
      />
      {shouldShowText && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize}
            fontWeight="400"
            style={{
              transformOrigin: `${x + width/2}px ${y + height/2}px`,
              transition: "transform 0.2s ease-out"
            }}
            className="hover:scale-[1.02]"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + fontSize + 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize * 0.7}
            style={{
              transformOrigin: `${x + width/2}px ${y + height/2}px`,
              transition: "transform 0.2s ease-out"
            }}
            className="hover:scale-[1.02]"
          >
            {percentage}%
          </text>
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Investment: ${data.value}M
        </p>
        <p className="text-sm text-muted-foreground">
          Allocation: {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export const InvestmentHeatmap = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Asset Class Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Investment allocation by asset class</p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={[data]}
              dataKey="size"
              stroke="#fff"
              content={<CustomContent x={0} y={0} width={0} height={0} name="" percentage={0} />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};