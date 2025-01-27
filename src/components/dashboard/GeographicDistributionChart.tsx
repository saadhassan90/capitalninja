import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface RegionData {
  region: string;
  count: number;
  totalAum: number;
}

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
        // Only process if it's in North America
        if (investor.hqcountry === 'United States' || 
            investor.hqcountry === 'USA' || 
            investor.hqcountry === 'Canada' || 
            investor.hqcountry === 'Mexico') {
          
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

  const getRegionColor = (geo: any) => {
    const stateName = geo.properties.name;
    const regionInfo = regionData?.find(d => {
      // Match state names or abbreviations
      return d.region === stateName || 
             d.region === geo.properties.postal;
    });
    
    if (!regionInfo) return "#F4F4F5"; // Light gray for regions with no data
    
    // Color scale based on investor count
    const maxCount = Math.max(...regionData.map(d => d.count));
    const intensity = (regionInfo.count / maxCount) * 0.8; // Max 80% intensity
    return `rgba(59, 130, 246, ${intensity})`; // Blue with varying opacity
  };

  const formatAUM = (aum: number) => {
    if (aum >= 1e12) return `$${(aum / 1e12).toFixed(1)}T`;
    if (aum >= 1e9) return `$${(aum / 1e9).toFixed(1)}B`;
    if (aum >= 1e6) return `$${(aum / 1e6).toFixed(1)}M`;
    return `$${aum.toFixed(0)}`;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Geographic Distribution (North America)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading map data...
          </div>
        ) : (
          <div className="relative" onMouseMove={handleMouseMove}>
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{
                scale: 1000
              }}
              style={{
                width: "100%",
                height: "400px"
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getRegionColor(geo)}
                      stroke="#FFF"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          fill: "#3B82F6",
                          outline: "none",
                          cursor: "pointer",
                        },
                      }}
                      onMouseEnter={() => {
                        const stateName = geo.properties.name;
                        const regionInfo = regionData?.find(d => 
                          d.region === stateName || 
                          d.region === geo.properties.postal
                        );
                        if (regionInfo) {
                          setTooltipContent(regionInfo);
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent(null);
                      }}
                    />
                  ))
                }
              </Geographies>
            </ComposableMap>
            {tooltipContent && (
              <div
                style={{
                  position: "absolute",
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y - 70,
                  transform: "translateX(-50%)",
                  backgroundColor: "white",
                  padding: "8px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontSize: "14px",
                  zIndex: 1000,
                }}
                className="border"
              >
                <div className="font-semibold">{tooltipContent.region}</div>
                <div>Investors: {tooltipContent.count}</div>
                <div>Total AUM: {formatAUM(tooltipContent.totalAum)}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}