export const assetClassColors = {
  privateEquity: {
    bg: '#8B5CF6', // Vivid Purple
    text: 'white'
  },
  realEstate: {
    bg: '#D946EF', // Magenta Pink
    text: 'white'
  },
  debtFunds: {
    bg: '#F97316', // Bright Orange
    text: 'white'
  },
  infrastructure: {
    bg: '#0EA5E9', // Ocean Blue
    text: 'white'
  },
  fofSecondaries: {
    bg: '#8E9196', // Neutral Gray
    text: 'white'
  },
  energy: {
    bg: '#F1F0FB', // Soft Gray
    text: '#1F2937'
  },
  other: {
    bg: '#F1F0FB', // Soft Gray
    text: '#1F2937'
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