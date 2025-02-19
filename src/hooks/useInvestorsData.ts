
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LimitedPartner } from "@/types/investor";
import type { SortConfig } from "@/types/sorting";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

interface UseInvestorsDataParams {
  searchTerm: string;
  selectedType: InvestorFilterType;
  selectedLocation: InvestorFilterType;
  selectedAssetClass: InvestorFilterType;
  selectedFirstTimeFunds: InvestorFilterType;
  selectedAUMRange: AUMRange;
  currentPage: number;
  sortConfig: SortConfig;
  onError?: (error: any) => void;
}

export function useInvestorsData({
  searchTerm,
  selectedType,
  selectedLocation,
  selectedAssetClass,
  selectedFirstTimeFunds,
  selectedAUMRange,
  currentPage,
  sortConfig,
  onError
}: UseInvestorsDataParams) {
  return useQuery({
    queryKey: ['investors', searchTerm, selectedType, selectedLocation, selectedAssetClass, selectedFirstTimeFunds, selectedAUMRange, currentPage, sortConfig],
    queryFn: async () => {
      let query = supabase
        .from('limited_partners')
        .select('*', { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.ilike('limited_partner_name', `%${searchTerm}%`);
      }

      if (selectedType) {
        query = query.eq('limited_partner_type', selectedType);
      }

      if (selectedLocation) {
        query = query.ilike('hqlocation', `%${selectedLocation}%`);
      }

      if (selectedAssetClass) {
        query = query.ilike('preferred_fund_type', `%${selectedAssetClass}%`);
      }

      if (selectedAUMRange) {
        if (selectedAUMRange.min !== null) {
          query = query.gte('aum', selectedAUMRange.min);
        }
        if (selectedAUMRange.max !== null) {
          query = query.lte('aum', selectedAUMRange.max);
        }
      }

      // Apply sorting
      query = query.order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });

      // Apply pagination
      query = query.range((currentPage - 1) * 200, currentPage * 200 - 1);

      const { data: investors, error, count } = await query;

      if (error) {
        console.error('Error fetching investors:', error);
        if (onError) onError(error);
        throw error;
      }

      // Transform data to match LimitedPartner type
      const transformedData = investors?.map(lp => ({
        id: lp.id,
        limited_partner_name: lp.limited_partner_name,
        limited_partner_type: lp.limited_partner_type,
        aum: lp.aum,
        hqlocation: lp.hqlocation,
        preferred_fund_type: lp.preferred_fund_type,
        primary_contact: lp.primary_contact,
        primary_contact_title: lp.primary_contact_title
      })) || [];

      return {
        data: transformedData,
        count: count || 0
      };
    }
  });
}
