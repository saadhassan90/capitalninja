import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { formatTooltipValue } from "@/utils/formatters";

interface AUMRange {
  range: string;
  count: number;
  totalAUM: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-sm text-gray-600">
          Number of LPs: {payload[0].payload.count}
        </p>
        <p className="text-sm text-gray-600">
          Total AUM: {formatTooltipValue(payload[0].payload.totalAUM)}
        </p>
      </div>
    );
  }
  return null;
};

export const AUMDistributionChart = () => {
  const { data: aumDistribution, isLoading } = useQuery({
    queryKey: ['aum-distribution'],
    queryFn: async () => {
      const { count: totalLPs } = await supabase
        .from('limited_partners')
        .select('*', { count: 'exact' });

      const ranges = [
        { min: 0, max: 1000000000, label: '0-1B' },
        { min: 1000000000, max: 5000000000, label: '1B-5B' },
        { min: 5000000000, max: 10000000000, label: '5B-10B' },
        { min: 10000000000, max: 50000000000, label: '10B-50B' },
        { min: 50000000000, max: null, label: '50B+' }
      ];

      const { data: lps } = await supabase
        .from('limited_partners')
        .select('aum');

      const distribution: AUMRange[] = ranges.map(range => {
        let filtered = lps?.filter(lp => {
          // Special case for 1B-5B range: include null AUM values
          if (range.min === 1000000000 && range.max === 5000000000) {
            return !lp.aum || (lp.aum >= range.min && lp.aum < range.max);
          }
          // Normal case for other ranges
          const aum = Number(lp.aum);
          return aum >= range.min && (range.max === null || aum < range.max);
        }) || [];

        return {
          range: range.label,
          count: filtered.length,
          totalAUM: filtered.reduce((sum, lp) => sum + (Number(lp.aum) || 0), 0)
        };
      });

      return {
        distribution,
        totalLPs,
      };
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-medium">AUM Distribution</CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Number of Limited Partners by AUM Range</p>
          <p className="text-xs">
            Total LPs: {aumDistribution?.totalLPs}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={aumDistribution?.distribution}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barCategoryGap={40}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range"
                tick={{ fill: '#666' }}
              />
              <YAxis 
                tick={{ fill: '#666' }}
                label={{ 
                  value: 'Number of LPs',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#666' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="#8ca6bd"
                radius={[8, 8, 0, 0]}
                barSize={32}
              >
                {aumDistribution?.distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    id={`bar-${index}`}
                    className="origin-center transition-transform duration-200 hover:animate-chart-hover"
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