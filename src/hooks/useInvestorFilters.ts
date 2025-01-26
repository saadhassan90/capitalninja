import { useState } from "react";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";
import type { SortConfig } from "@/types/sorting";

export function useInvestorFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<InvestorFilterType>(null);
  const [selectedLocation, setSelectedLocation] = useState<InvestorFilterType>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<InvestorFilterType>(null);
  const [selectedFirstTimeFunds, setSelectedFirstTimeFunds] = useState<InvestorFilterType>(null);
  const [selectedAUMRange, setSelectedAUMRange] = useState<AUMRange>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
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

  return {
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
  };
}