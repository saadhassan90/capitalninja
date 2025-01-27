import { RegionData } from "../types/map-types";

export const getRegionColor = (
  geo: any, 
  regionData: RegionData[], 
  isCanada: boolean = false
) => {
  const regionName = isCanada ? geo.properties.name : geo.properties.name;
  const regionCode = isCanada ? geo.properties.code : geo.properties.postal;
  
  const regionInfo = regionData?.find(d => {
    return d.region === regionName || d.region === regionCode;
  });
  
  if (!regionInfo) return "#E2E8F0"; // Light gray for regions with no data
  
  // Color scale based on investor count using a more prominent blue
  const maxCount = Math.max(...regionData.map(d => d.count));
  const intensity = (regionInfo.count / maxCount) * 0.9; // Max 90% intensity
  return `rgba(14, 165, 233, ${intensity + 0.1})`; // Ocean Blue with minimum 10% opacity
};

export const formatAUM = (aum: number) => {
  if (aum >= 1e12) return `$${(aum / 1e12).toFixed(1)}T`;
  if (aum >= 1e9) return `$${(aum / 1e9).toFixed(1)}B`;
  if (aum >= 1e6) return `$${(aum / 1e6).toFixed(1)}M`;
  return `$${aum.toFixed(0)}`;
};