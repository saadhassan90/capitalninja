import type { Database } from "@/integrations/supabase/types";

type GeographicRegionType = Database['public']['Enums']['geographic_region_type'];

export const geographyOptions: GeographicRegionType[] = [
  "North America - US",
  "North America - Canada",
  "North America - Mexico",
  "North America - Caribbean",
  "Europe - UK",
  "Europe - Western",
  "Europe - Eastern",
  "Europe - Nordic",
  "MENA - GCC",
  "MENA - North Africa",
  "MENA - Levant",
  "Africa - Sub-Saharan",
  "Asia - East Asia",
  "Asia - South Asia",
  "Asia - Southeast Asia",
  "Asia - Central Asia",
  "South America - Brazil",
  "South America - Southern Cone",
  "South America - Andean",
  "Other - Pacific",
  "Other - Global"
];