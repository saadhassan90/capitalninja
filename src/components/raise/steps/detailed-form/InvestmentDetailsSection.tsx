import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../../RaiseFormContext";
import type { AssetClassType } from "../../RaiseFormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiCombobox } from "@/components/ui/multi-combobox";
import { geographyOptions } from "@/data/geography-options";

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

      <div className="col-span-2 space-y-2">
        <Label>Geographic Focus</Label>
        <MultiCombobox
          options={geographyOptions}
          selected={formData.geographic_focus}
          onChange={(values) => updateFormData({ geographic_focus: values })}
          placeholder="Select regions..."
        />
      </div>
    </div>
  );
}