// Main asset class colors with a broader palette
const mainColors = {
  privateEquity: '#1B4965',    // Deep Blue
  buyout: '#2C699A',          // Medium Blue
  growth: '#3E7CB1',          // Light Blue
  realEstate: '#F97316',      // Orange
  privateCredit: '#5FA777',   // Forest Green
  venture: '#93C5FD',         // Sky Blue
  earlyStage: '#BFDBFE',      // Lighter Sky Blue
  lateStage: '#60A5FA',       // Bright Sky Blue
  energy: '#F4A261',          // Warm Orange
  infrastructure: '#2A9D8F',  // Teal
  secondaries: '#8B5CF6',     // Purple
  fundOfFunds: '#A78BFA',     // Light Purple
  distressed: '#EF4444',      // Red
  mezzanine: '#10B981',       // Emerald
  other: '#6C757D',          // Neutral Gray
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
  privateEquity: {
    bg: mainColors.privateEquity,
    text: 'white'
  },
  buyout: {
    bg: mainColors.buyout,
    text: 'white'
  },
  growth: {
    bg: mainColors.growth,
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
    text: '#1B4965'
  },
  earlyStage: {
    bg: mainColors.earlyStage,
    text: '#1B4965'
  },
  lateStage: {
    bg: mainColors.lateStage,
    text: 'white'
  },
  energy: {
    bg: mainColors.energy,
    text: '#1B4965'
  },
  infrastructure: {
    bg: mainColors.infrastructure,
    text: 'white'
  },
  secondaries: {
    bg: mainColors.secondaries,
    text: 'white'
  },
  fundOfFunds: {
    bg: mainColors.fundOfFunds,
    text: 'white'
  },
  distressed: {
    bg: mainColors.distressed,
    text: 'white'
  },
  mezzanine: {
    bg: mainColors.mezzanine,
    text: 'white'
  },
  other: {
    bg: mainColors.other,
    text: 'white'
  },
  debtFunds: {
    bg: mainColors.privateCredit,
    text: 'white'
  }
};

export type AssetClass = keyof typeof assetClassColors;

export const getAssetClassStyle = (assetClass: AssetClass) => {
  const colors = assetClassColors[assetClass] || assetClassColors.other;
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
  };
};

// Helper function to map fund types to their appropriate asset class
export const mapFundTypeToAssetClass = (type: string): AssetClass => {
  type = type.toLowerCase().trim();
  
  if (type.includes('buyout')) return 'buyout';
  if (type.includes('growth') || type.includes('expansion')) return 'growth';
  if (type.includes('real estate')) return 'realEstate';
  if (type.includes('early stage') || type.includes('seed')) return 'earlyStage';
  if (type.includes('late stage')) return 'lateStage';
  if (type.includes('venture') || type.includes('vc')) return 'venture';
  if (type.includes('energy')) return 'energy';
  if (type.includes('infrastructure')) return 'infrastructure';
  if (type.includes('secondaries')) return 'secondaries';
  if (type.includes('fund of funds') || type.includes('fof')) return 'fundOfFunds';
  if (type.includes('distressed')) return 'distressed';
  if (type.includes('mezzanine')) return 'mezzanine';
  if (type.includes('credit') || type.includes('debt')) return 'debtFunds';
  if (type.includes('private equity') || type.includes('pe')) return 'privateEquity';
  
  return 'other';
};