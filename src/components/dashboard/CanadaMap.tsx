import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { MapProps } from "./types/map-types";
import { getRegionColor } from "./utils/map-utils";

const canadaGeoUrl = "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson";

export function CanadaMap({ regionData, onRegionHover, onMouseMove }: MapProps) {
  return (
    <div className="relative" onMouseMove={onMouseMove}>
      <h3 className="text-sm font-medium mb-2">Canada</h3>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 800,
          center: [-96, 60]
        }}
        style={{
          width: "100%",
          height: "400px"
        }}
      >
        <Geographies geography={canadaGeoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getRegionColor(geo, regionData, true)}
                stroke="#94A3B8"
                strokeWidth={0.75}
                style={{
                  default: {
                    outline: "none",
                  },
                  hover: {
                    fill: "#0EA5E9",
                    outline: "none",
                    cursor: "pointer",
                  },
                }}
                onMouseEnter={() => {
                  const provinceName = geo.properties.name;
                  const regionInfo = regionData?.find(d => 
                    d.region === provinceName || 
                    d.region === geo.properties.code
                  );
                  if (regionInfo) {
                    onRegionHover(regionInfo);
                  }
                }}
                onMouseLeave={() => {
                  onRegionHover(null);
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}