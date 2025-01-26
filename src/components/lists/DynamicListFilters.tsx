import { TypeFilter } from "@/components/investors/filters/TypeFilter";
import { LocationFilter } from "@/components/investors/filters/LocationFilter";
import { AssetClassFilter } from "@/components/investors/filters/AssetClassFilter";
import { FirstTimeFundsFilter } from "@/components/investors/filters/FirstTimeFundsFilter";
import { AUMRangeFilter } from "@/components/investors/filters/AUMRangeFilter";
import { Label } from "@/components/ui/label";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

interface DynamicListFiltersProps {
  onFiltersChange: (filters: {
    type: InvestorFilterType;
    location: InvestorFilterType;
    assetClass: InvestorFilterType;
    firstTimeFunds: InvestorFilterType;
    aumRange: AUMRange;
  }) => void;
}

export function DynamicListFilters({ onFiltersChange }: DynamicListFiltersProps) {
  const handleFilterChange = (
    type: InvestorFilterType = null,
    location: InvestorFilterType = null,
    assetClass: InvestorFilterType = null,
    firstTimeFunds: InvestorFilterType = null,
    aumRange: AUMRange = null
  ) => {
    onFiltersChange({
      type,
      location,
      assetClass,
      firstTimeFunds,
      aumRange,
    });
  };

  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      <Label className="text-sm font-medium">Dynamic List Filters</Label>
      <div className="space-y-4">
        <TypeFilter 
          onTypeChange={(type) => handleFilterChange(type)} 
        />
        <LocationFilter 
          onLocationChange={(location) => handleFilterChange(null, location)} 
        />
        <AssetClassFilter 
          onAssetClassChange={(assetClass) => handleFilterChange(null, null, assetClass)} 
        />
        <FirstTimeFundsFilter 
          onFirstTimeFundsChange={(firstTimeFunds) => handleFilterChange(null, null, null, firstTimeFunds)} 
        />
        <AUMRangeFilter 
          onAUMRangeChange={(range) => handleFilterChange(null, null, null, null, range)} 
        />
      </div>
    </div>
  );
}