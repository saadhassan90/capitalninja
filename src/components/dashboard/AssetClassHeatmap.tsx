import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { CHART_DATA } from "./heatmap/constants";

const transformDataForHeatmap = () => {
  const data = CHART_DATA.children.map(item => ({
    asset: item.name.split(' ')[0],
    allocation: item.percentage,
    size: item.size
  }));

  return [{
    id: "Asset Allocation",
    data: data.map(d => ({
      x: d.asset,
      y: d.allocation
    }))
  }];
};

export const AssetClassHeatmap = () => {
  const data = transformDataForHeatmap();

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-medium">Asset Class Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Investment allocation across asset classes in 2024</p>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveHeatMap
          data={data}
          margin={{ top: 20, right: 20, bottom: 60, left: 110 }}
          valueFormat=">-.2s"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Asset Class',
            legendPosition: 'middle',
            legendOffset: 45
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Allocation',
            legendPosition: 'middle',
            legendOffset: -80
          }}
          colors={{
            type: 'sequential',
            scheme: 'blues'
          }}
          emptyColor="#555555"
          borderRadius={4}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.4]]
          }}
          enableLabels={true}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 2]]
          }}
          annotations={[]}
          tooltip={({ xLabel, yLabel, value }) => (
            <div className="bg-white p-3 border rounded-lg shadow-sm">
              <p className="font-medium text-sm">{xLabel}</p>
              <p className="text-sm text-gray-600">
                Allocation: {yLabel}%
              </p>
            </div>
          )}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#666',
                  fontSize: 12
                }
              },
              legend: {
                text: {
                  fill: '#666',
                  fontSize: 12
                }
              }
            }
          }}
        />
      </CardContent>
    </Card>
  );
};