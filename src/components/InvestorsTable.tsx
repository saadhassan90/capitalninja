
import { useState } from "react";
import { useInvestorsData } from "@/hooks/useInvestorsData";
import { InvestorProfile } from "./InvestorProfile";
import { InvestorsSearch } from "./investors/InvestorsSearch";
import { InvestorsTableView } from "./investors/InvestorsTableView";
import { BulkActions } from "./investors/BulkActions";
import { useToast } from "@/hooks/use-toast";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";
import type { SortConfig } from "@/types/sorting";
import type { InvestorContact } from "@/types/investor-contact";

export function InvestorsTable({ listId }: { listId?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<InvestorFilterType>(null);
  const [selectedLocation, setSelectedLocation] = useState<InvestorFilterType>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<InvestorFilterType>(null);
  const [selectedFirstTimeFunds, setSelectedFirstTimeFunds] = useState<InvestorFilterType>(null);
  const [selectedAUMRange, setSelectedAUMRange] = useState<AUMRange>(null);
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { toast } = useToast();

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

  const handleFilterChange = (
    type: InvestorFilterType, 
    location: InvestorFilterType, 
    assetClass: InvestorFilterType,
    firstTimeFunds: InvestorFilterType,
    aumRange: AUMRange
  ) => {
    if (type !== null) setSelectedType(type === '_all' ? null : type);
    if (location !== null) setSelectedLocation(location === '_all' ? null : location);
    if (assetClass !== null) setSelectedAssetClass(assetClass === '_all' ? null : assetClass);
    if (firstTimeFunds !== null) setSelectedFirstTimeFunds(firstTimeFunds === '_all' ? null : firstTimeFunds);
    if (aumRange !== null) setSelectedAUMRange(aumRange);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = (investorsData?.data || []).map(investor => investor.id.toString());
      setSelectedInvestors(allIds);
    } else {
      setSelectedInvestors([]);
    }
  };

  const handleSelectInvestor = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInvestors(prev => [...prev, id]);
    } else {
      setSelectedInvestors(prev => prev.filter(investorId => investorId !== id));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
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
              selectedInvestors={selectedInvestors}
              onClearSelection={() => setSelectedInvestors([])}
              listId={listId}
            />
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Total Investors: {investorsData?.count ?? 0}
        </div>
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
