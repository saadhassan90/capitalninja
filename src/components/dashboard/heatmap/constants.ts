export const HEATMAP_COLORS = [
  '#8ca6bd', // Light Blue Grey
  '#7199bc', // Medium Blue Grey
  '#5b7b98', // Blue Grey
  '#718597', // Grey Blue
  '#556573', // Dark Grey Blue
  '#465f75'  // Deep Grey Blue
] as const;

export const CHART_DATA = {
  "name": "Asset Classes",
  "children": [
    {
      "name": "Private Equity (PE)",
      "size": 1150,
      "percentage": 30
    },
    {
      "name": "Venture Capital (VC)",
      "size": 600,
      "percentage": 15
    },
    {
      "name": "Real Estate (RE)",
      "size": 900,
      "percentage": 23
    },
    {
      "name": "Infrastructure",
      "size": 450,
      "percentage": 12
    },
    {
      "name": "Private Credit (PC)",
      "size": 700,
      "percentage": 18
    },
    {
      "name": "Energy",
      "size": 120,
      "percentage": 2
    }
  ]
};