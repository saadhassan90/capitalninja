import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvestorsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: (type: string | null, location: string | null, assetClass: string | null, firstTimeFunds: string | null) => void;
}

export function InvestorsSearch({ value, onChange, onFilterChange }: InvestorsSearchProps) {
  const locations = [
    { label: "United States", value: "US" },
    { label: "Canada", value: "Canada" },
    { label: "Europe", value: "Europe" },
    { label: "Middle East & North Africa", value: "MENA" },
    { label: "Asia", value: "Asia" },
    { label: "Latin America", value: "LatAm" },
    { label: "Other", value: "Other" }
  ];

  const types = [
    "Pension Fund",
    "Endowment",
    "Foundation",
    "Family Office",
    "Fund of Funds",
    "Insurance Company",
    "Asset Manager",
    "Other"
  ];

  const assetClasses = [
    "Private Equity",
    "Venture Capital",
    "Real Estate",
    "Private Credit",
    "Infrastructure",
    "Energy",
    "Fund of Funds",
    "Other"
  ];

  return (
    <div className="mb-6 flex gap-4 items-center flex-wrap">
      <Input
        placeholder="Search investors..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm focus:outline-none focus:ring-0 focus:border-gray-300"
      />
      
      <Select onValueChange={(value) => onFilterChange(value, null, null, null)}>
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

      <Select onValueChange={(value) => onFilterChange(null, value, null, null)}>
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

      <Select onValueChange={(value) => onFilterChange(null, null, value, null)}>
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

      <Select onValueChange={(value) => onFilterChange(null, null, null, value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="First Time Funds" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">All</SelectItem>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}