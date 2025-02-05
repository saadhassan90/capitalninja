import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { useToast } from "@/hooks/use-toast";
import { BulkActions } from "@/components/investors/BulkActions";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import type { SortConfig } from "@/types/sorting";
import { useListInvestors } from "@/hooks/useListInvestors";

const ListView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { data: list } = useQuery({
    queryKey: ['list', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: investorsData, isLoading } = useListInvestors({
    listId: id!,
    currentPage,
    sortConfig,
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
            {list?.description && (
              <p className="text-muted-foreground mt-2">{list.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => {}}>
              <Send className="h-4 w-4 mr-2" />
              Campaign
            </Button>
            <Button onClick={() => {}}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        {selectedInvestors.length > 0 && (
          <BulkActions 
            selectedCount={selectedInvestors.length}
            selectedInvestors={selectedInvestors}
            onClearSelection={() => setSelectedInvestors([])}
            listId={id}
          />
        )}
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
        listId={id}
      />
    </div>
  );
};

export default ListView;