import { MapTooltipProps } from "./types/map-types";
import { formatAUM } from "./utils/map-utils";

export function MapTooltip({ content, position }: MapTooltipProps) {
  if (!content) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x + 10,
        top: position.y - 70,
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
      <div className="font-semibold">{content.region}</div>
      <div>Investors: {content.count}</div>
      <div>Total AUM: {formatAUM(content.totalAum)}</div>
    </div>
  );
}