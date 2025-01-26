import { Input } from "@/components/ui/input";
import { FiltersMenu } from "./FiltersMenu";
import { FilterChangeHandler } from "@/types/investorFilters";

interface InvestorsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: FilterChangeHandler;
}

export function InvestorsSearch({ value, onChange, onFilterChange }: InvestorsSearchProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Search investors..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-sm focus:outline-none focus:ring-0 focus:border-gray-300"
        />
        <FiltersMenu onFilterChange={onFilterChange} />
      </div>
    </div>
  );
}