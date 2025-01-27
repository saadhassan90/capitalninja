export const INVESTOR_CATEGORIES = {
  'Single Family Offices': ['Single Family Office', 'SFO', 'Single-Family Office'],
  'Multi Family Offices': ['Multi Family Office', 'MFO', 'Multi-Family Office'],
  'Pensions': ['Pension', 'Pension Fund', 'Public Pension'],
  'Insurance Companies': ['Insurance', 'Insurance Company'],
  'Endowments': ['Endowment'],
  'Foundations': ['Foundation'],
  'Wealth Managers': ['Wealth Manager', 'Wealth Management'],
  'Other': []
};

export const categorizeInvestorType = (type: string | null): string => {
  if (!type) return 'Other';
  
  if (type.toLowerCase().includes('family office')) {
    if (type.toLowerCase().includes('single') || 
        type.toLowerCase().includes('sfo')) {
      return 'Single Family Offices';
    } else if (type.toLowerCase().includes('multi') || 
              type.toLowerCase().includes('mfo')) {
      return 'Multi Family Offices';
    }
    return 'Single Family Offices';
  }

  for (const [category, keywords] of Object.entries(INVESTOR_CATEGORIES)) {
    if (category === 'Other' || category.includes('Family Office')) continue;
    
    if (keywords.some(keyword => 
      type.toLowerCase().includes(keyword.toLowerCase())
    )) {
      return category;
    }
  }

  return 'Other';
};