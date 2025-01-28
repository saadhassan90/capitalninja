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
      const { data: listInvestors, error: listInvestorsError, count } = await supabase
        .from('list_investors')
        .select('investor_id', { count: 'exact' })
        .eq('list_id', listId)
        .range((currentPage - 1) * 200, currentPage * 200 - 1);

      if (listInvestorsError) throw listInvestorsError;

      if (!listInvestors?.length) {
        return { data: [], count: 0 };
      }

      const investorIds = listInvestors.map(li => li.investor_id);

      const { data: investors, error: investorsError } = await supabase
        .from('limited_partners')
        .select('*')
        .in('id', investorIds)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });

      if (investorsError) throw investorsError;

      return { data: investors || [], count: count || 0 };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    meta: {
      onError: (error: any) => {
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