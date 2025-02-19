
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvestorFilterType } from "@/types/investorFilters";

interface TypeFilterProps {
  onTypeChange: (value: InvestorFilterType) => void;
}

export function TypeFilter({ onTypeChange }: TypeFilterProps) {
  const types = [
    "Pension Fund",
    "Endowment",
    "Foundation",
    "Family Office",
    "Single Family Office",
    "Multi Family Office",
    "Fund of Funds",
    "Insurance Company",
    "Asset Manager",
    "Sovereign Wealth Fund",
    "Bank",
    "Corporate",
    "Development Finance Institution",
    "Investment Company",
    "Investment Bank",
    "Private Investment Office",
    "Other"
  ];

  const handleTypeChange = (value: string) => {
    if (value === '_all') {
      onTypeChange(null);
      return;
    }

    // Special handling for Family Office types
    if (value === 'Family Office') {
      onTypeChange('Family Office');
      return;
    }

    onTypeChange(value);
  };

  return (
    <Select onValueChange={handleTypeChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_all">All Types</SelectItem>
        {types.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
