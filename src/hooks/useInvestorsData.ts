
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InvestorContact } from "@/types/investor-contact";
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
        .from('investor_contacts')
        .select(`
          *,
          limited_partners!inner (
            id,
            limited_partner_name,
            limited_partner_type,
            aum,
            preferred_fund_type,
            preferred_commitment_size_min,
            preferred_commitment_size_max,
            preferred_geography,
            hqlocation,
            description,
            total_commitments_in_pefunds,
            direct_investments
          )
        `, { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.ilike('limited_partners.limited_partner_name', `%${searchTerm}%`);
      }

      if (selectedType) {
        query = query.eq('limited_partners.limited_partner_type', selectedType);
      }

      if (selectedLocation) {
        query = query.ilike('limited_partners.hqlocation', `%${selectedLocation}%`);
      }

      if (selectedAssetClass) {
        query = query.ilike('limited_partners.preferred_fund_type', `%${selectedAssetClass}%`);
      }

      if (selectedAUMRange) {
        if (selectedAUMRange.min !== null) {
          query = query.gte('limited_partners.aum', selectedAUMRange.min);
        }
        if (selectedAUMRange.max !== null) {
          query = query.lte('limited_partners.aum', selectedAUMRange.max);
        }
      }

      // Fixed order syntax for foreign key relationships
      if (sortConfig.column === 'limited_partner_name') {
        query = query.order('limited_partners(limited_partner_name)', { ascending: sortConfig.direction === 'asc' });
      } else {
        query = query.order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      }

      // Apply pagination
      query = query.range((currentPage - 1) * 200, currentPage * 200 - 1);

      const { data: contacts, error, count } = await query;

      if (error) {
        console.error('Error fetching investors:', error);
        if (onError) onError(error);
        throw error;
      }

      // Transform the data to match InvestorContact type
      const transformedData: InvestorContact[] = contacts?.map(contact => ({
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
        strategy: contact.limited_partners.preferred_geography || null,
        minInvestmentSize: contact.limited_partners.preferred_commitment_size_min,
        maxInvestmentSize: contact.limited_partners.preferred_commitment_size_max,
        geographicFocus: contact.limited_partners.preferred_geography,
        totalFundCommitments: contact.limited_partners.total_commitments_in_pefunds,
        totalDirectInvestments: contact.limited_partners.direct_investments
      })) || [];

      return {
        data: transformedData,
        count: count || 0
      };
    }
  });
}
