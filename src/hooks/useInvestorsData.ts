import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";
import type { LimitedPartner } from "@/types/investor";
import type { SortConfig } from "@/types/sorting";

const INVESTORS_PER_PAGE = 200;

interface UseInvestorsDataParams {
  searchTerm: string;
  selectedType: InvestorFilterType;
  selectedLocation: InvestorFilterType;
  selectedAssetClass: InvestorFilterType;
  selectedFirstTimeFunds: InvestorFilterType;
  selectedAUMRange: AUMRange;
  currentPage: number;
  sortConfig: SortConfig;
  onError?: (error: Error) => void;
}

async function fetchInvestors({
  searchTerm,
  selectedType,
  selectedLocation,
  selectedAssetClass,
  selectedFirstTimeFunds,
  selectedAUMRange,
  currentPage,
  sortConfig,
}: UseInvestorsDataParams) {
  const start = (currentPage - 1) * INVESTORS_PER_PAGE;
  
  let query = supabase
    .from('limited_partners')
    .select('id, limited_partner_name, limited_partner_type, aum, hqlocation, preferred_fund_type, primary_contact, primary_contact_title, count:id', { count: 'exact' })
    .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' })
    .range(start, start + INVESTORS_PER_PAGE - 1);

  if (searchTerm) {
    query = query.ilike('limited_partner_name', `%${searchTerm}%`);
  }

  if (selectedType && selectedType !== '_all') {
    if (typeof selectedType === 'function') {
      // Handle Family Office filter
      query = query.or('limited_partner_type.eq.Family Office,limited_partner_type.eq.Single Family Office,limited_partner_type.eq.Multi Family Office');
    } else {
      query = query.eq('limited_partner_type', selectedType);
    }
  }

  if (selectedLocation && selectedLocation !== '_all') {
    if (selectedLocation === 'US') {
      query = query.ilike('hqlocation', '%United States%');
    } else if (selectedLocation === 'MENA') {
      query = query.or('hqlocation.ilike.%Middle East%,hqlocation.ilike.%North Africa%');
    } else {
      query = query.ilike('hqlocation', `%${selectedLocation}%`);
    }
  }

  if (selectedAssetClass && selectedAssetClass !== '_all') {
    query = query.ilike('preferred_fund_type', `%${selectedAssetClass}%`);
  }

  if (selectedFirstTimeFunds && selectedFirstTimeFunds !== '_all') {
    query = query.eq('open_to_first_time_funds', selectedFirstTimeFunds);
  }

  if (selectedAUMRange) {
    const [min, max] = selectedAUMRange;
    query = query.gte('aum', min * 1000000).lte('aum', max * 1000000);
  }

  const { data, error, count } = await query;
  
  if (error) {
    throw error;
  }
  
  return { data, count };
}

export function useInvestorsData(params: UseInvestorsDataParams) {
  return useQuery({
    queryKey: ['investors', params],
    queryFn: () => fetchInvestors(params),
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('rate limit')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}