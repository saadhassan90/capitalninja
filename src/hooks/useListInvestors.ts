
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SortConfig } from "@/types/sorting";
import type { InvestorContact } from "@/types/investor-contact";

interface UseListInvestorsParams {
  listId: string;
  currentPage: number;
  sortConfig: SortConfig;
}

export function useListInvestors({ listId, currentPage, sortConfig }: UseListInvestorsParams) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['listInvestors', listId, currentPage, sortConfig],
    queryFn: async () => {
      console.log('Fetching contacts for list:', listId);
      
      // First get the list contacts
      const { data: listContacts, error: listContactsError, count } = await supabase
        .from('list_investors')
        .select('contact_id', { count: 'exact' })
        .eq('list_id', listId)
        .range((currentPage - 1) * 200, currentPage * 200 - 1);

      if (listContactsError) {
        console.error('Error fetching list contacts:', listContactsError);
        throw listContactsError;
      }

      console.log('Found list contacts:', listContacts);

      if (!listContacts?.length) {
        console.log('No contacts found for list');
        return { data: [], count: 0 };
      }

      const contactIds = listContacts.map(lc => lc.contact_id).filter(Boolean);
      
      if (contactIds.length === 0) {
        return { data: [], count: 0 };
      }

      console.log('Fetching contact details for IDs:', contactIds);

      // Map sort column to the correct table
      const sortColumn = sortConfig.column === 'limited_partner_name' ? 
        'limited_partners.limited_partner_name' : sortConfig.column;

      // Join with limited_partners to get company information
      const { data: contacts, error: contactsError } = await supabase
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
        `)
        .in('id', contactIds)
        .order(sortColumn, { ascending: sortConfig.direction === 'asc' });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        throw contactsError;
      }

      // Transform the data to match our expected format
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
        // Add the missing properties
        minInvestmentSize: contact.limited_partners.preferred_commitment_size_min,
        maxInvestmentSize: contact.limited_partners.preferred_commitment_size_max,
        geographicFocus: contact.limited_partners.preferred_geography,
        totalFundCommitments: contact.limited_partners.total_commitments_in_pefunds,
        totalDirectInvestments: contact.limited_partners.direct_investments
      })) || [];

      console.log('Successfully fetched contacts:', transformedData.length);
      return { data: transformedData, count: count || 0 };
    },
    enabled: !!listId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
