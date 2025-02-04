import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useRaiseForm } from "../../RaiseFormContext";

const assetClassOptions = [
  "Real Estate",
  "Private Equity",
  "Private Credit",
  "Energy",
  "Infrastructure",
  "Venture Capital",
  "Startups",
  "Fund of Funds",
  "Special Opportunities",
  "Private Debt",
  "Natural Resources",
  "Secondaries",
  "Co-Investment",
  "Impact Investing",
  "Other"
];

const geographicOptions = [
  "North America",
  "Europe",
  "Asia",
  "Latin America",
  "Middle East",
  "Africa",
];

export function InvestmentDetailsSection() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Asset Classes</Label>
        <MultiSelect
          options={assetClassOptions}
          selected={formData.asset_classes || []}
          onChange={(value) => updateFormData({ asset_classes: value })}
          placeholder="Select asset classes"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="investment_type">Investment Type</Label>
        <Input
          id="investment_type"
          value={formData.investment_type || ""}
          onChange={(e) => updateFormData({ investment_type: e.target.value })}
          placeholder="Direct or Indirect"
        />
      </div>

      <div className="space-y-2">
        <Label>Geographic Focus</Label>
        <MultiSelect
          options={geographicOptions}
          selected={formData.geographic_focus || []}
          onChange={(value) => updateFormData({ geographic_focus: value })}
          placeholder="Select regions"
        />
      </div>
    </div>
  );
}