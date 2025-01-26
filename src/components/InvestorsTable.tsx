import { useState } from "react";
import { useInvestorsData } from "@/hooks/useInvestorsData";
import { InvestorProfile } from "./InvestorProfile";
import { InvestorsSearch } from "./investors/InvestorsSearch";
import { InvestorsTableView } from "./investors/InvestorsTableView";
import { BulkActions } from "./investors/BulkActions";
import { useToast } from "@/hooks/use-toast";
import { useInvestorSelection } from "@/hooks/useInvestorSelection";
import { useInvestorFilters } from "@/hooks/useInvestorFilters";

export function InvestorsTable() {
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    selectedInvestors,
    setSelectedInvestors,
    handleSelectAll,
    handleSelectInvestor
  } = useInvestorSelection();

  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    selectedLocation,
    selectedAssetClass,
    selectedFirstTimeFunds,
    selectedAUMRange,
    currentPage,
    setCurrentPage,
    sortConfig,
    handleFilterChange,
    handleSort
  } = useInvestorFilters();

  const { data: investorsData, isLoading, error } = useInvestorsData({
    searchTerm,
    selectedType,
    selectedLocation,
    selectedAssetClass,
    selectedFirstTimeFunds,
    selectedAUMRange,
    currentPage,
    sortConfig,
    onError: (error) => {
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
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <InvestorsSearch 
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          onFilterChange={handleFilterChange}
        />
        {selectedInvestors.length > 0 && (
          <BulkActions 
            selectedCount={selectedInvestors.length} 
            onClearSelection={() => setSelectedInvestors([])}
            selectedInvestors={selectedInvestors}
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