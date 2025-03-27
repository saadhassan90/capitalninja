
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
      // First, get a count of all investors that match the filters
      let countQuery = supabase
        .from('limited_partners')
        .select('id', { count: 'exact' });

      // Apply filters to count query
      if (searchTerm) {
        countQuery = countQuery.ilike('limited_partner_name', `%${searchTerm}%`);
      }

      if (selectedType) {
        countQuery = countQuery.eq('limited_partner_type', selectedType);
      }

      if (selectedLocation) {
        countQuery = countQuery.ilike('hqlocation', `%${selectedLocation}%`);
      }

      if (selectedAssetClass) {
        countQuery = countQuery.ilike('preferred_fund_type', `%${selectedAssetClass}%`);
      }

      if (selectedAUMRange) {
        if (selectedAUMRange.min !== null) {
          countQuery = countQuery.gte('aum', selectedAUMRange.min);
        }
        if (selectedAUMRange.max !== null) {
          countQuery = countQuery.lte('aum', selectedAUMRange.max);
        }
      }

      const { count } = await countQuery;
      
      // If there are less than 300 investors matching the filters,
      // return all of them without randomizing
      if (count && count <= 300) {
        let query = supabase
          .from('limited_partners')
          .select('*');

        // Apply the same filters
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

        const { data: investors, error } = await query;

        if (error) {
          console.error('Error fetching investors:', error);
          if (onError) onError(error);
          throw error;
        }

        return {
          data: transformLimitedPartners(investors || []),
          count: count
        };
      } 
      // If there are more than 300 investors, select 300 random ones
      else {
        // Get all IDs that match the filters
        let idsQuery = supabase
          .from('limited_partners')
          .select('id');

        // Apply the same filters to the IDs query
        if (searchTerm) {
          idsQuery = idsQuery.ilike('limited_partner_name', `%${searchTerm}%`);
        }

        if (selectedType) {
          idsQuery = idsQuery.eq('limited_partner_type', selectedType);
        }

        if (selectedLocation) {
          idsQuery = idsQuery.ilike('hqlocation', `%${selectedLocation}%`);
        }

        if (selectedAssetClass) {
          idsQuery = idsQuery.ilike('preferred_fund_type', `%${selectedAssetClass}%`);
        }

        if (selectedAUMRange) {
          if (selectedAUMRange.min !== null) {
            idsQuery = idsQuery.gte('aum', selectedAUMRange.min);
          }
          if (selectedAUMRange.max !== null) {
            idsQuery = idsQuery.lte('aum', selectedAUMRange.max);
          }
        }

        const { data: allIds, error: idsError } = await idsQuery;

        if (idsError) {
          console.error('Error fetching investor IDs:', idsError);
          if (onError) onError(idsError);
          throw idsError;
        }

        if (!allIds || allIds.length === 0) {
          return { data: [], count: 0 };
        }

        // Randomly select 300 IDs
        const randomIds = selectRandomIds(allIds, 300);
        
        // Fetch the random investors
        const { data: randomInvestors, error } = await supabase
          .from('limited_partners')
          .select('*')
          .in('id', randomIds)
          .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });

        if (error) {
          console.error('Error fetching random investors:', error);
          if (onError) onError(error);
          throw error;
        }

        return {
          data: transformLimitedPartners(randomInvestors || []),
          count: 300 // Set count to 300 since we're returning 300 random investors
        };
      }
    }
  });
}

// Helper function to transform limited partners data
function transformLimitedPartners(investors: any[]): LimitedPartner[] {
  return investors.map(lp => ({
    id: lp.id,
    limited_partner_name: lp.limited_partner_name,
    limited_partner_type: lp.limited_partner_type,
    aum: lp.aum,
    hqlocation: lp.hqlocation,
    preferred_fund_type: lp.preferred_fund_type,
    primary_contact: lp.primary_contact,
    primary_contact_title: lp.primary_contact_title
  }));
}

// Helper function to select random IDs
function selectRandomIds(ids: { id: number }[], count: number): number[] {
  // If we have fewer IDs than the count, return all IDs
  if (ids.length <= count) {
    return ids.map(item => item.id);
  }
  
  // Create a copy of the array to avoid modifying the original
  const idsArray = [...ids];
  const result: number[] = [];
  
  // Fisher-Yates shuffle algorithm to select random IDs
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * idsArray.length);
    result.push(idsArray[randomIndex].id);
    idsArray.splice(randomIndex, 1); // Remove the selected ID to avoid duplicates
  }
  
  return result;
}
