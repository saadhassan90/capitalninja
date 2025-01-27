import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { getChartColors } from "@/utils/chartColors";

interface InvestmentData {
  asset_class: string;
  invested_billion: number;
  percentage: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium text-sm">{data.asset_class}</p>
        <p className="text-sm text-gray-600">
          Investment: ${data.invested_billion}B
          <br />
          Share: {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const INVESTMENT_DATA = [
  {
    asset_class: "Private Equity (PE)",
    invested_billion: 1150,
    percentage: 30
  },
  {
    asset_class: "Venture Capital (VC)",
    invested_billion: 600,
    percentage: 15
  },
  {
    asset_class: "Real Estate (RE)",
    invested_billion: 900,
    percentage: 23
  },
  {
    asset_class: "Infrastructure",
    invested_billion: 450,
    percentage: 12
  },
  {
    asset_class: "Private Credit (PC)",
    invested_billion: 700,
    percentage: 18
  },
  {
    asset_class: "Commodities",
    invested_billion: 120,
    percentage: 3
  },
  {
    asset_class: "Energy",
    invested_billion: 100,
    percentage: 2
  }
];

export const InvestmentHeatmap = () => {
  const colors = getChartColors(INVESTMENT_DATA.length);

  const CustomizedContent = (props: any) => {
    const { x, y, width, height, index } = props;
    const data = INVESTMENT_DATA[index];

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1
          }}
        />
        {width > 50 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-medium"
          >
            {data.asset_class}
            {width > 90 && height > 90 && (
              <tspan x={x + width / 2} y={y + height / 2 + 14}>
                {data.percentage}%
              </tspan>
            )}
          </text>
        )}
      </g>
    );
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-medium">Investment Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Asset class allocation in 2024</p>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={INVESTMENT_DATA}
            dataKey="invested_billion"
            aspectRatio={1}
            stroke="white"
            fill="#8884d8"
          >
            {INVESTMENT_DATA.map((entry, index) => (
              <Treemap
                key={`tree-${index}`}
                dataKey="invested_billion"
                content={<CustomizedContent index={index} />}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};