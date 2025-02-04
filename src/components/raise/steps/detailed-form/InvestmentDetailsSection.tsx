import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../../RaiseFormContext";
import type { AssetClassType } from "../../RaiseFormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  {
    category: "United States",
    regions: ["North America - US"]
  },
  {
    category: "Canada",
    regions: ["North America - Canada"]
  },
  {
    category: "Mexico",
    regions: ["North America - Mexico"]
  },
  {
    category: "Caribbean",
    regions: ["North America - Caribbean"]
  }
];

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
        <Select
          value={formData.geographic_focus?.[0] || ""}
          onValueChange={(value) => updateFormData({ geographic_focus: [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {geographicOptions.map((group) => (
              <div key={group.category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {group.category}
                </div>
                {group.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}