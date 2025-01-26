import { useState } from "react";
import { useInvestorsData } from "@/hooks/useInvestorsData";
import { InvestorProfile } from "./InvestorProfile";
import { InvestorsSearch } from "./investors/InvestorsSearch";
import { InvestorsTableView } from "./investors/InvestorsTableView";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

export function InvestorsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<InvestorFilterType>(null);
  const [selectedLocation, setSelectedLocation] = useState<InvestorFilterType>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<InvestorFilterType>(null);
  const [selectedFirstTimeFunds, setSelectedFirstTimeFunds] = useState<InvestorFilterType>(null);
  const [selectedAUMRange, setSelectedAUMRange] = useState<AUMRange>(null);
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: investorsData, isLoading, error } = useInvestorsData({
    searchTerm,
    selectedType,
    selectedLocation,
    selectedAssetClass,
    selectedFirstTimeFunds,
    selectedAUMRange,
    currentPage,
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

  if (error) {
    return <div>Error loading investors</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <InvestorsSearch 
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onFilterChange={handleFilterChange}
      />
      
      <InvestorsTableView 
        investors={investorsData?.data ?? []}
        isLoading={isLoading}
        onViewInvestor={setSelectedInvestorId}
        currentPage={currentPage}
        totalPages={Math.ceil((investorsData?.count ?? 0) / 200)}
        onPageChange={setCurrentPage}
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