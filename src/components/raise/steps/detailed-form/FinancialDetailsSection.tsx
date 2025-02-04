import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const capitalStackOptions = [
  "General Partner",
  "Limited Partner",
  "Syndication",
  "Co-Investor",
];

interface FinancialDetailsSectionProps {
  formData: {
    minimum_ticket_size: string;
    capital_stack: string[];
    gp_capital: string;
    carried_interest: string;
    asset_management_fee: string;
  };
  onChange: (data: Partial<FinancialDetailsSectionProps['formData']>) => void;
}

export function FinancialDetailsSection({ formData, onChange }: FinancialDetailsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="minimum_ticket_size">Minimum Ticket Size</Label>
        <Input
          id="minimum_ticket_size"
          type="number"
          value={formData.minimum_ticket_size}
          onChange={(e) => onChange({ minimum_ticket_size: e.target.value })}
          placeholder="Enter minimum ticket size"
        />
      </div>

      <div className="space-y-2">
        <Label>Capital Stack</Label>
        <Select 
          value={formData.capital_stack[0] || ""} 
          onValueChange={(value) => onChange({ capital_stack: [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select capital stack position" />
          </SelectTrigger>
          <SelectContent>
            {capitalStackOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gp_capital">GP Capital (%)</Label>
        <Input
          id="gp_capital"
          type="number"
          step="0.01"
          value={formData.gp_capital}
          onChange={(e) => onChange({ gp_capital: e.target.value })}
          placeholder="Enter GP capital percentage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carried_interest">Carried Interest (%)</Label>
        <Input
          id="carried_interest"
          type="number"
          step="0.01"
          value={formData.carried_interest}
          onChange={(e) => onChange({ carried_interest: e.target.value })}
          placeholder="Enter carried interest percentage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset_management_fee">Asset Management Fee (%)</Label>
        <Input
          id="asset_management_fee"
          type="number"
          step="0.01"
          value={formData.asset_management_fee}
          onChange={(e) => onChange({ asset_management_fee: e.target.value })}
          placeholder="Enter asset management fee percentage"
        />
      </div>
    </div>
  );
}