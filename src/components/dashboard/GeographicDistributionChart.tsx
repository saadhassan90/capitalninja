import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USMap } from "./USMap";
import { CanadaMap } from "./CanadaMap";
import { MapTooltip } from "./MapTooltip";
import type { RegionData } from "./types/map-types";

export function GeographicDistributionChart() {
  const [tooltipContent, setTooltipContent] = useState<RegionData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const { data: regionData = [], isLoading } = useQuery({
    queryKey: ['geographic-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('limited_partners')
        .select('hqstate_province, hqcountry, aum')
        .not('hqstate_province', 'is', null);

      if (error) throw error;

      const regions = new Map<string, RegionData>();
      
      data.forEach(investor => {
        if (investor.hqcountry === 'United States' || 
            investor.hqcountry === 'USA' || 
            investor.hqcountry === 'Canada') {
          
          const region = investor.hqstate_province?.trim() || 'Unknown';
          const existing = regions.get(region) || { region, count: 0, totalAum: 0 };
          regions.set(region, {
            region,
            count: existing.count + 1,
            totalAum: existing.totalAum + (investor.aum || 0)
          });
        }
      });

      return Array.from(regions.values());
    }
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Geographic Distribution</CardTitle>
        <div className="text-sm text-muted-foreground">
          Distribution of Limited Partners across North America
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading map data...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <USMap 
              regionData={regionData}
              onRegionHover={setTooltipContent}
              onMouseMove={handleMouseMove}
            />
            <CanadaMap 
              regionData={regionData}
              onRegionHover={setTooltipContent}
              onMouseMove={handleMouseMove}
            />
            <MapTooltip 
              content={tooltipContent}
              position={tooltipPosition}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}