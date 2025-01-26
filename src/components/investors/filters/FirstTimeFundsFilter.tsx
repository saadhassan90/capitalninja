import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvestorFilterType } from "@/types/investorFilters";

interface FirstTimeFundsFilterProps {
  onFirstTimeFundsChange: (value: InvestorFilterType) => void;
}

export function FirstTimeFundsFilter({ onFirstTimeFundsChange }: FirstTimeFundsFilterProps) {
  return (
    <Select onValueChange={(value) => onFirstTimeFundsChange(value === '_all' ? null : value)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="First Time Funds" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_all">All</SelectItem>
        <SelectItem value="yes">Yes</SelectItem>
        <SelectItem value="no">No</SelectItem>
      </SelectContent>
    </Select>
  );
}