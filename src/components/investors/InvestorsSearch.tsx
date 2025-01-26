import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface InvestorsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange: (type: string | null, location: string | null, assetClass: string | null, firstTimeFunds: string | null, aumRange: [number, number] | null) => void;
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

  // AUM ranges in billions
  const maxAUM = 1000; // $1T
  const defaultAUMRange = [0, maxAUM];
  const formatAUM = (value: number) => {
    if (value >= 1000) return `$${value/1000}T`;
    return `$${value}B`;
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <Input
          placeholder="Search investors..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-sm focus:outline-none focus:ring-0 focus:border-gray-300"
        />
        
        <Select onValueChange={(value) => onFilterChange(value, null, null, null, null)}>
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

        <Select onValueChange={(value) => onFilterChange(null, value, null, null, null)}>
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

        <Select onValueChange={(value) => onFilterChange(null, null, value, null, null)}>
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

        <Select onValueChange={(value) => onFilterChange(null, null, null, value, null)}>
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

      <div className="space-y-2 max-w-xl">
        <div className="flex justify-between items-center">
          <Label>AUM Range</Label>
          <div className="text-sm text-muted-foreground">
            {formatAUM(defaultAUMRange[0])} - {formatAUM(defaultAUMRange[1])}
          </div>
        </div>
        <Slider
          defaultValue={defaultAUMRange}
          max={maxAUM}
          step={10}
          onValueChange={(value) => onFilterChange(null, null, null, null, value as [number, number])}
          className="w-full"
        />
      </div>
    </div>
  );
}