import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvestorFilterType } from "@/types/investorFilters";

interface LocationFilterProps {
  onLocationChange: (value: InvestorFilterType) => void;
}

export function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const locations = [
    { label: "United States", value: "US" },
    { label: "Canada", value: "Canada" },
    { label: "Europe", value: "Europe" },
    { label: "Middle East & North Africa", value: "MENA" },
    { label: "Asia", value: "Asia" },
    { label: "Latin America", value: "LatAm" },
    { label: "Other", value: "Other" }
  ];

  return (
    <Select onValueChange={(value) => onLocationChange(value === '_all' ? null : value)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_all">All Locations</SelectItem>
        {locations.map((location) => (
          <SelectItem key={location.value} value={location.value}>
            {location.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}