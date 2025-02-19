
import { type AssetClass } from "@/types/assetClass";

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
  debtFunds: '#5FA777',      // Forest Green
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
    bg: mainColors.debtFunds,
    text: 'white'
  }
};

export type AssetClassType = keyof typeof assetClassColors;

export const getAssetClassStyle = (type: string) => {
  const normalizedType = type.toLowerCase().trim() as AssetClassType;
  const colors = assetClassColors[normalizedType] || assetClassColors.other;
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
  };
};

export const mapFundTypeToAssetClass = (type: string): AssetClassType => {
  const normalizedType = type.toLowerCase().trim();
  
  if (normalizedType.includes('buyout')) return 'buyout';
  if (normalizedType.includes('growth') || normalizedType.includes('expansion')) return 'growth';
  if (normalizedType.includes('real estate')) return 'realEstate';
  if (normalizedType.includes('early stage') || normalizedType.includes('seed')) return 'earlyStage';
  if (normalizedType.includes('late stage')) return 'lateStage';
  if (normalizedType.includes('venture') || normalizedType.includes('vc')) return 'venture';
  if (normalizedType.includes('energy')) return 'energy';
  if (normalizedType.includes('infrastructure')) return 'infrastructure';
  if (normalizedType.includes('secondaries')) return 'secondaries';
  if (normalizedType.includes('fund of funds') || normalizedType.includes('fof')) return 'fundOfFunds';
  if (normalizedType.includes('distressed')) return 'distressed';
  if (normalizedType.includes('mezzanine')) return 'mezzanine';
  if (normalizedType.includes('credit') || normalizedType.includes('debt')) return 'debtFunds';
  if (normalizedType.includes('private equity') || normalizedType.includes('pe')) return 'privateEquity';
  
  return 'other';
};
