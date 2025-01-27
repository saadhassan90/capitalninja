// Consistent purple color palette for all charts
export const CHART_COLORS = [
  '#6E59A5', // Dark Purple
  '#8B5CF6', // Vivid Purple
  '#7E69AB', // Medium Purple
  '#1A1F2C', // Deep Dark Purple
  '#9B87F5', // Primary Purple
  '#7C3AED', // Rich Purple
  '#5B21B6', // Deep Purple
  '#4C1D95'  // Royal Purple
] as const;

// Helper function to get colors for charts
export const getChartColors = (count: number): string[] => {
  return CHART_COLORS.slice(0, count);
};