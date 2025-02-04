import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SortConfig } from "@/types/sorting";

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
      console.log('Fetching investors for list:', listId);
      
      // First get the list investors
      const { data: listInvestors, error: listInvestorsError, count } = await supabase
        .from('list_investors')
        .select('investor_id', { count: 'exact' })
        .eq('list_id', listId)
        .range((currentPage - 1) * 200, currentPage * 200 - 1);

      if (listInvestorsError) {
        console.error('Error fetching list investors:', listInvestorsError);
        throw listInvestorsError;
      }

      console.log('Found list investors:', listInvestors);

      if (!listInvestors?.length) {
        console.log('No investors found for list');
        return { data: [], count: 0 };
      }

      const investorIds = listInvestors.map(li => li.investor_id);
      console.log('Fetching investor details for IDs:', investorIds);

      const { data: investors, error: investorsError } = await supabase
        .from('limited_partners')
        .select('*')
        .in('id', investorIds)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });

      if (investorsError) {
        console.error('Error fetching investors:', investorsError);
        throw investorsError;
      }

      console.log('Successfully fetched investors:', investors?.length);
      return { data: investors || [], count: count || 0 };
    },
    enabled: !!listId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    meta: {
      onError: (error: any) => {
        console.error('Query error:', error);
        if (error?.message?.includes('rate limit')) {
          toast({
            title: "Rate Limit Reached",
            description: "Please wait a moment before making more requests.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load investors data. Please try again later.",
            variant: "destructive",
          });
        }
      },
    },
  });
}