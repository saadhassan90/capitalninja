// Main asset class colors from financial color palette
const mainColors = {
  privateEquity: '#1B4965', // Deep Blue
  realEstate: '#F97316',   // Bright Orange
  privateCredit: '#5FA777', // Forest Green
  venture: '#7209B7',      // Deep Purple
  energy: '#F4A261',       // Warm Orange
  infrastructure: '#2A9D8F', // Teal
  other: '#6C757D',        // Neutral Gray
};

// Generate lighter shades for sub-asset classes
const generateLighterShade = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

export const assetClassColors = {
  // Main asset classes
  privateEquity: {
    bg: mainColors.privateEquity,
    text: 'white'
  },
  realEstate: {
    bg: mainColors.realEstate,
    text: 'white'
  },
  privateCredit: {
    bg: mainColors.privateCredit,
    text: 'white'
  },
  venture: {
    bg: mainColors.venture,
    text: 'white'
  },
  energy: {
    bg: mainColors.energy,
    text: '#1B4965' // Dark text for contrast
  },
  infrastructure: {
    bg: mainColors.infrastructure,
    text: 'white'
  },
  other: {
    bg: mainColors.other,
    text: 'white'
  },
  
  // Sub-asset classes (using lighter shades)
  debtFunds: {
    bg: generateLighterShade(mainColors.privateCredit, 20),
    text: '#1B4965'
  },
  fofSecondaries: {
    bg: generateLighterShade(mainColors.privateEquity, 40),
    text: '#1B4965'
  },
  buyout: {
    bg: mainColors.privateEquity,
    text: 'white'
  },
  growth: {
    bg: generateLighterShade(mainColors.privateEquity, 20),
    text: 'white'
  },
  residential: {
    bg: generateLighterShade(mainColors.realEstate, 20),
    text: 'white'
  },
  commercial: {
    bg: generateLighterShade(mainColors.realEstate, 40),
    text: 'white'
  }
};

export type AssetClass = keyof typeof assetClassColors;

export const getAssetClassStyle = (assetClass: AssetClass) => {
  const colors = assetClassColors[assetClass];
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
  };
};