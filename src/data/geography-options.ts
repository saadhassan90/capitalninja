import type { Database } from "@/integrations/supabase/types";

type GeographicRegionType = Database['public']['Enums']['geographic_region_type'];

interface GeographyOption {
  value: GeographicRegionType;
  label: string;
  group?: string;
}

export const geographyOptions: GeographyOption[] = [
  // North America
  { value: "North America - US", label: "United States", group: "North America" },
  { value: "North America - Canada", label: "Canada", group: "North America" },
  { value: "North America - Mexico", label: "Mexico", group: "North America" },
  { value: "North America - Caribbean", label: "Caribbean", group: "North America" },
  
  // Europe
  { value: "Europe - UK", label: "United Kingdom", group: "Europe" },
  { value: "Europe - Western", label: "Western Europe", group: "Europe" },
  { value: "Europe - Eastern", label: "Eastern Europe", group: "Europe" },
  { value: "Europe - Nordic", label: "Nordic Countries", group: "Europe" },
  
  // MENA
  { value: "MENA - GCC", label: "Gulf Cooperation Council", group: "Middle East & North Africa" },
  { value: "MENA - North Africa", label: "North Africa", group: "Middle East & North Africa" },
  { value: "MENA - Levant", label: "Levant", group: "Middle East & North Africa" },
  
  // Africa
  { value: "Africa - Sub-Saharan", label: "Sub-Saharan Africa", group: "Africa" },
  
  // Asia
  { value: "Asia - East Asia", label: "East Asia", group: "Asia" },
  { value: "Asia - South Asia", label: "South Asia", group: "Asia" },
  { value: "Asia - Southeast Asia", label: "Southeast Asia", group: "Asia" },
  { value: "Asia - Central Asia", label: "Central Asia", group: "Asia" },
  
  // South America
  { value: "South America - Brazil", label: "Brazil", group: "South America" },
  { value: "South America - Southern Cone", label: "Southern Cone", group: "South America" },
  { value: "South America - Andean", label: "Andean Region", group: "South America" },
  
  // Other
  { value: "Other - Pacific", label: "Pacific Region", group: "Other" },
  { value: "Other - Global", label: "Global", group: "Other" }
];

export type { GeographyOption, GeographicRegionType };
