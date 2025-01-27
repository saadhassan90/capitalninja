import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvestorFilterType } from "@/types/investorFilters";

interface AssetClassFilterProps {
  onAssetClassChange: (value: InvestorFilterType) => void;
}

export function AssetClassFilter({ onAssetClassChange }: AssetClassFilterProps) {
  const assetClasses = [
    "Private Equity",
    "Venture Capital",
    "Real Estate",
    "Private Credit",
    "Infrastructure",
    "Energy",
    "Fund of Funds",
    "Special Opportunities",
    "Private Debt",
    "Natural Resources",
    "Secondaries",
    "Co-Investment",
    "Impact Investing",
    "Other"
  ];

  return (
    <Select onValueChange={(value) => onAssetClassChange(value === '_all' ? null : value)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Asset Class" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_all">All Asset Classes</SelectItem>
        {assetClasses.map((assetClass) => (
          <SelectItem key={assetClass} value={assetClass}>
            {assetClass}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}