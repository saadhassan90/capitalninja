import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";
import { CustomTooltip } from "./heatmap/CustomTooltip";
import { TreemapContent } from "./heatmap/TreemapContent";
import { CHART_DATA } from "./heatmap/constants";

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
          >
            {({ root }) => <TreemapContent root={root} />}
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};