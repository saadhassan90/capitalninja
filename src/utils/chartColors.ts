// Monochromatic color palette for all charts
export const CHART_COLORS = [
  '#8ca6bd', // Light Blue Grey
  '#7199bc', // Medium Blue Grey
  '#5b7b98', // Blue Grey
  '#718597', // Grey Blue
  '#556573', // Dark Grey Blue
  '#465f75'  // Deep Grey Blue
] as const;

// Helper function to get colors for charts
export const getChartColors = (count: number): string[] => {
  return CHART_COLORS.slice(0, count);
};