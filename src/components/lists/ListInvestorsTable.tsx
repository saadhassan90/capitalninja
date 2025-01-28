import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestorProfile } from "@/components/InvestorProfile";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { BulkActions } from "@/components/investors/BulkActions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { SortConfig } from "@/types/sorting";

interface ListInvestorsTableProps {
  listId: string;
}

export function ListInvestorsTable({ listId }: ListInvestorsTableProps) {
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { toast } = useToast();

  const { data: investorsData, isLoading, refetch } = useQuery({
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
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache garbage collection after 30 minutes
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

  const handleSort = (column: string) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = (investorsData?.data || []).map(investor => investor.id);
      setSelectedInvestors(allIds);
    } else {
      setSelectedInvestors([]);
    }
  };

  const handleSelectInvestor = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedInvestors(prev => [...prev, id]);
    } else {
      setSelectedInvestors(prev => prev.filter(investorId => investorId !== id));
    }
  };

  const handleRefresh = async () => {
    try {
      // First, trigger the refresh function
      const { error: refreshError } = await supabase
        .rpc('refresh_dynamic_lists');

      if (refreshError) throw refreshError;

      // Then refetch the data
      await refetch();

      toast({
        title: "List Refreshed",
        description: "The list has been updated with the latest data.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to refresh the list. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          {selectedInvestors.length > 0 ? (
            <BulkActions
              selectedCount={selectedInvestors.length}
              selectedInvestors={selectedInvestors}
              onClearSelection={() => setSelectedInvestors([])}
              listId={listId}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              Total Investors: {investorsData?.count ?? 0}
            </div>
          )}
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="ml-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh List
        </Button>
      </div>

      <InvestorsTableView 
        investors={investorsData?.data ?? []}
        isLoading={isLoading}
        onViewInvestor={setSelectedInvestorId}
        currentPage={currentPage}
        totalPages={Math.ceil((investorsData?.count ?? 0) / 200)}
        onPageChange={setCurrentPage}
        sortConfig={sortConfig}
        onSort={handleSort}
        selectedInvestors={selectedInvestors}
        onSelectAll={handleSelectAll}
        onSelectInvestor={handleSelectInvestor}
      />

      {selectedInvestorId && (
        <InvestorProfile
          investorId={selectedInvestorId}
          open={selectedInvestorId !== null}
          onOpenChange={(open) => !open && setSelectedInvestorId(null)}
        />
      )}
    </div>
  );
}