import { useState } from "react";
import { InvestorProfile } from "@/components/InvestorProfile";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { ListHeader } from "./ListHeader";
import { useListInvestors } from "@/hooks/useListInvestors";
import type { SortConfig } from "@/types/sorting";
import { useToast } from "@/hooks/use-toast";

interface ListInvestorsTableProps {
  listId: string;
}

export function ListInvestorsTable({ listId }: ListInvestorsTableProps) {
  const { toast } = useToast();
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { data: investorsData, isLoading, error } = useListInvestors({
    listId,
    currentPage,
    sortConfig,
  });

  if (error) {
    console.error('Error in ListInvestorsTable:', error);
    toast({
      title: "Error",
      description: "Failed to load investors. Please try again.",
      variant: "destructive",
    });
  }

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

  return (
    <div className="flex flex-col">
      <ListHeader
        selectedInvestors={selectedInvestors}
        totalInvestors={investorsData?.count ?? 0}
        listId={listId}
        onClearSelection={() => setSelectedInvestors([])}
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
        listId={listId}
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