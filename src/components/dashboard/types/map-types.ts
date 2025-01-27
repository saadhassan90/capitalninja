export interface RegionData {
  region: string;
  count: number;
  totalAum: number;
}

export interface MapTooltipProps {
  content: RegionData | null;
  position: { x: number; y: number };
}

export interface MapProps {
  regionData: RegionData[];
  onRegionHover: (data: RegionData | null) => void;
  onMouseMove: (event: React.MouseEvent) => void;
}