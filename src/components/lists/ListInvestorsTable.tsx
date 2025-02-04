import { useState } from "react";
import { InvestorProfile } from "@/components/InvestorProfile";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { ListHeader } from "./ListHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import type { SortConfig } from "@/types/sorting";

interface ListInvestorsTableProps {
  listId: string;
}

export function ListInvestorsTable({ listId }: ListInvestorsTableProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { data: investorsData, isLoading, error, refetch } = useQuery({
    queryKey: ['listInvestors', listId, currentPage, sortConfig],
    queryFn: async () => {
      if (!user) throw new Error('Authentication required');

      console.log('Fetching investors for list:', listId);
      
      const { data: listInvestors, error: listInvestorsError, count } = await supabase
        .from('list_investors')
        .select('investor_id', { count: 'exact' })
        .eq('list_id', listId)
        .range((currentPage - 1) * 200, currentPage * 200 - 1);

      if (listInvestorsError) {
        console.error('Error fetching list investors:', listInvestorsError);
        throw listInvestorsError;
      }

      if (!listInvestors?.length) {
        return { data: [], count: 0 };
      }

      const investorIds = listInvestors.map(li => li.investor_id);

      const { data: investors, error: investorsError } = await supabase
        .from('limited_partners')
        .select('*')
        .in('id', investorIds)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });

      if (investorsError) {
        console.error('Error fetching investors:', investorsError);
        throw investorsError;
      }

      return { data: investors || [], count: count || 0 };
    },
    enabled: !!listId && !!user,
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

  if (error) {
    console.error('Error in ListInvestorsTable:', error);
    toast({
      title: "Error",
      description: "Failed to load investors. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col">
      <ListHeader
        selectedInvestors={selectedInvestors}
        totalInvestors={investorsData?.count ?? 0}
        listId={listId}
        onClearSelection={() => setSelectedInvestors([])}
        onRefresh={refetch}
      />

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