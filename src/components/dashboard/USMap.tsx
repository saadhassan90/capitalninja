import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { MapProps } from "./types/map-types";
import { getRegionColor } from "./utils/map-utils";

const usGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export function USMap({ regionData, onRegionHover, onMouseMove }: MapProps) {
  return (
    <div className="relative" onMouseMove={onMouseMove}>
      <h3 className="text-sm font-medium mb-2">United States</h3>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1200
        }}
        style={{
          width: "100%",
          height: "400px"
        }}
      >
        <Geographies geography={usGeoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const regionInfo = regionData?.find(d => 
                d.region === stateName || 
                d.region === geo.properties.postal
              );
              const isActive = !!regionInfo;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getRegionColor(geo, regionData)}
                  stroke="#94A3B8"
                  strokeWidth={0.75}
                  style={{
                    default: {
                      outline: "none",
                      transition: "all 250ms",
                    },
                    hover: {
                      fill: isActive ? "#0EA5E9" : "#E2E8F0",
                      outline: "none",
                      cursor: isActive ? "pointer" : "default",
                      transition: "all 250ms",
                    },
                  }}
                  onMouseEnter={() => {
                    if (regionInfo) {
                      onRegionHover(regionInfo);
                    }
                  }}
                  onMouseLeave={() => {
                    onRegionHover(null);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}