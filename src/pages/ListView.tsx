import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { useToast } from "@/hooks/use-toast";
import { BulkActions } from "@/components/investors/BulkActions";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Home, ListChecks } from "lucide-react";
import type { SortConfig } from "@/types/sorting";
import { useListInvestors } from "@/hooks/useListInvestors";
import { InvestorProfile } from "@/components/InvestorProfile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ListView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
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

  // Query for monthly exports and limits
  const { data: exportLimits } = useQuery({
    queryKey: ['export-limits'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .single();

      if (!teamMember) throw new Error('No team found');

      const [{ count: monthlyExports }, { data: teamLimit }] = await Promise.all([
        supabase
          .from('exports')
          .select('records', { count: 'exact', head: true })
          .eq('team_id', teamMember.id)
          .gte('created_at', startOfMonth.toISOString())
          .not('records', 'is', null),
        supabase
          .from('team_export_limits')
          .select('monthly_limit')
          .eq('team_id', teamMember.id)
          .single()
      ]);

      return {
        used: monthlyExports || 0,
        limit: teamLimit?.monthly_limit ?? 200
      };
    }
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

  const handleExport = async () => {
    if (!id) return;
    
    try {
      setIsExporting(true);

      // Check if export would exceed monthly limit
      if (exportLimits && investorsData?.data.length) {
        const wouldExceedLimit = exportLimits.used + investorsData.data.length > exportLimits.limit;
        if (wouldExceedLimit) {
          toast({
            title: "Export Limit Reached",
            description: `You've reached your monthly export limit of ${exportLimits.limit} records. Current usage: ${exportLimits.used} records.`,
            variant: "destructive",
          });
          return;
        }
      }
      
      const { data, error } = await supabase.functions.invoke('export-list-investors', {
        body: { listId: id }
      });

      if (error) {
        throw error;
      }

      // Create a blob from the CSV content
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `investor-list-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: "Your investor list has been exported successfully.",
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export investor list.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/lists" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Lists
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{list?.name || 'List Details'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
            {list?.description && (
              <p className="text-muted-foreground mt-2">{list.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {exportLimits && (
              <p className="text-sm text-muted-foreground">
                Exports this month: {exportLimits.used}/{exportLimits.limit} records
              </p>
            )}
            <Button 
              onClick={handleExport} 
              disabled={isExporting || (exportLimits && exportLimits.used >= exportLimits.limit)}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export"}
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

      {selectedInvestorId && (
        <InvestorProfile
          investorId={selectedInvestorId}
          open={selectedInvestorId !== null}
          onOpenChange={(open) => !open && setSelectedInvestorId(null)}
        />
      )}
    </div>
  );
};

export default ListView;
