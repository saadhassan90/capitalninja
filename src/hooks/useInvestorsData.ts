
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InvestorContact } from "@/types/investor-contact";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";
import type { SortConfig } from "@/types/sorting";

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

export function useInvestorsData({
  searchTerm,
  selectedType,
  selectedLocation,
  selectedAssetClass,
  selectedFirstTimeFunds,
  selectedAUMRange,
  currentPage,
  sortConfig,
  onError,
}: UseInvestorsDataParams) {
  return useQuery({
    queryKey: ['investors', {
      searchTerm,
      selectedType,
      selectedLocation,
      selectedAssetClass,
      selectedFirstTimeFunds,
      selectedAUMRange,
      currentPage,
      sortConfig
    }],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('investor_contacts')
        .select(`
          *,
          limited_partners!inner (
            id,
            limited_partner_name,
            limited_partner_type,
            aum,
            preferred_fund_type,
            hqlocation,
            description,
            preferred_geography
          )
        `, { count: 'exact' });

      if (error) throw error;

      const transformedData: InvestorContact[] = (data || []).map(contact => ({
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        title: contact.title,
        company_name: contact.limited_partners.limited_partner_name,
        linkedin_url: contact.linkedin_url,
        company_id: contact.company_id,
        is_primary_contact: contact.is_primary_contact,
        notes: contact.notes,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
        companyType: contact.limited_partners.limited_partner_type,
        companyAUM: contact.limited_partners.aum,
        assetClasses: contact.limited_partners.preferred_fund_type ? 
          contact.limited_partners.preferred_fund_type.split(',').map(s => s.trim()) : [],
        location: contact.limited_partners.hqlocation,
        companyDescription: contact.limited_partners.description,
        strategy: contact.limited_partners.preferred_geography
      }));

      return { data: transformedData, count };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
