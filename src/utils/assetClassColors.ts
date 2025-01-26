export const assetClassColors = {
  privateEquity: {
    bg: '#1B4965', // Deep Blue
    text: 'white'
  },
  realEstate: {
    bg: '#62B6CB', // Medium Blue
    text: 'white'
  },
  debtFunds: {
    bg: '#5FA777', // Forest Green
    text: 'white'
  },
  infrastructure: {
    bg: '#CAE9FF', // Light Blue
    text: '#1B4965' // Dark text for contrast
  },
  fofSecondaries: {
    bg: '#BEE9E8', // Mint
    text: '#1B4965'
  },
  energy: {
    bg: '#62B6CB', // Medium Blue
    text: 'white'
  },
  other: {
    bg: '#CAE9FF', // Light Blue
    text: '#1B4965'
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