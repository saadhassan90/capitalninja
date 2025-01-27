import { useState } from "react";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { LoadingState } from "@/components/ui/loading-state";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SortConfig } from "@/types/sorting";

const Investors = () => {
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { data: investors, isLoading } = useQuery({
    queryKey: ['investors', currentPage, sortConfig],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('limited_partners')
        .select('*', { count: 'exact' })
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' })
        .range((currentPage - 1) * 200, currentPage * 200 - 1);
      return { data: data || [], count: count || 0 };
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
      const allIds = (investors?.data || []).map(investor => investor.id);
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

  return (
    <div className="p-8">
      <LoadingState loading={isLoading}>
        <InvestorsTableView 
          investors={investors?.data || []}
          isLoading={isLoading}
          onViewInvestor={setSelectedInvestorId}
          currentPage={currentPage}
          totalPages={Math.ceil((investors?.count || 0) / 200)}
          onPageChange={setCurrentPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          selectedInvestors={selectedInvestors}
          onSelectAll={handleSelectAll}
          onSelectInvestor={handleSelectInvestor}
        />
      </LoadingState>
    </div>
  );
};

export default Investors;