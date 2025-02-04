import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const assetClassOptions = [
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
] as const;

interface InvestmentDetailsSectionProps {
  formData: {
    assetClass: string;
    investment_type: string;
    city: string;
    state: string;
    country: string;
  };
  onChange: (data: Partial<InvestmentDetailsSectionProps['formData']>) => void;
}

export function InvestmentDetailsSection({ formData, onChange }: InvestmentDetailsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Asset Classes</Label>
        <Select 
          value={formData.assetClass}
          onValueChange={(value) => onChange({ assetClass: value })}
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
          onValueChange={(value) => onChange({ investment_type: value })}
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
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => onChange({ city: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State/Province</Label>
        <Input
          id="state"
          placeholder="Enter state/province"
          value={formData.state}
          onChange={(e) => onChange({ state: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          placeholder="Enter country"
          value={formData.country}
          onChange={(e) => onChange({ country: e.target.value })}
        />
      </div>
    </div>
  );
}