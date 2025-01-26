import { Input } from "@/components/ui/input";
import { TypeFilter } from "./filters/TypeFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { AssetClassFilter } from "./filters/AssetClassFilter";
import { FirstTimeFundsFilter } from "./filters/FirstTimeFundsFilter";
import { AUMRangeFilter } from "./filters/AUMRangeFilter";
import { FilterChangeHandler } from "@/types/investorFilters";

interface InvestorsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: FilterChangeHandler;
}

export function InvestorsSearch({ value, onChange, onFilterChange }: InvestorsSearchProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <Input
          placeholder="Search investors..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-sm focus:outline-none focus:ring-0 focus:border-gray-300"
        />
        
        <TypeFilter 
          onTypeChange={(type) => onFilterChange(type, null, null, null, null)} 
        />
        
        <LocationFilter 
          onLocationChange={(location) => onFilterChange(null, location, null, null, null)} 
        />
        
        <AssetClassFilter 
          onAssetClassChange={(assetClass) => onFilterChange(null, null, assetClass, null, null)} 
        />
        
        <FirstTimeFundsFilter 
          onFirstTimeFundsChange={(firstTimeFunds) => onFilterChange(null, null, null, firstTimeFunds, null)} 
        />
      </div>

      <AUMRangeFilter 
        onAUMRangeChange={(range) => onFilterChange(null, null, null, null, range)} 
      />
    </div>
  );
}