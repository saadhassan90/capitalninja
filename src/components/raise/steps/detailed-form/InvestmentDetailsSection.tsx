import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../../RaiseFormContext";
import type { AssetClassType } from "../../RaiseFormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

// Sort asset classes alphabetically
const assetClassOptions: AssetClassType[] = [
  "Co-Investment",
  "Energy",
  "Fund of Funds",
  "Impact Investing",
  "Infrastructure",
  "Natural Resources",
  "Other",
  "Private Credit",
  "Private Debt",
  "Private Equity",
  "Real Estate",
  "Secondaries",
  "Special Opportunities",
  "Startups",
  "Venture Capital"
];

const geographicOptions = [
  "North America",
  "Europe",
  "Asia",
  "Latin America",
  "Middle East",
  "Africa",
].sort();

export function InvestmentDetailsSection() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Asset Classes</Label>
        <Select 
          value={formData.assetClass}
          onValueChange={(value) => updateFormData({ assetClass: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select asset class" />
          </SelectTrigger>
          <SelectContent>
            {assetClassOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="investment_type">Investment Type</Label>
        <Select 
          value={formData.investment_type}
          onValueChange={(value) => updateFormData({ investment_type: value })}
        >
          <SelectTrigger id="investment_type">
            <SelectValue placeholder="Select investment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="direct">Direct</SelectItem>
            <SelectItem value="indirect">Indirect</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Geographic Focus</Label>
        <MultiSelect
          options={geographicOptions}
          selected={formData.geographic_focus}
          onChange={(value) => updateFormData({ geographic_focus: value })}
          placeholder="Select regions"
        />
      </div>
    </div>
  );
}