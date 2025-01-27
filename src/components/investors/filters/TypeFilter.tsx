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

  return (
    <Select onValueChange={(value) => onTypeChange(value === '_all' ? null : value)}>
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