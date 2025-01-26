import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { TypeFilter } from "./filters/TypeFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { AssetClassFilter } from "./filters/AssetClassFilter";
import { FirstTimeFundsFilter } from "./filters/FirstTimeFundsFilter";
import { AUMRangeFilter } from "./filters/AUMRangeFilter";
import { FilterChangeHandler } from "@/types/investorFilters";

interface FiltersMenuProps {
  onFilterChange: FilterChangeHandler;
}

export function FiltersMenu({ onFilterChange }: FiltersMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[340px] p-4 space-y-4">
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
        <AUMRangeFilter 
          onAUMRangeChange={(range) => onFilterChange(null, null, null, null, range)} 
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}