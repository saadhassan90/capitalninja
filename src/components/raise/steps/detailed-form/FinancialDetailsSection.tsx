import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../../RaiseFormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const capitalStackOptions = [
  "General Partner",
  "Limited Partner",
  "Syndication",
  "Co-Investor",
];

export function FinancialDetailsSection() {
  const { formData, updateFormData } = useRaiseForm();

  const handleCapitalStackChange = (value: string) => {
    updateFormData({ capital_stack: [value] });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="minimum_ticket_size">Minimum Ticket Size</Label>
        <Input
          id="minimum_ticket_size"
          type="number"
          value={formData.minimum_ticket_size || ""}
          onChange={(e) => updateFormData({ minimum_ticket_size: e.target.value })}
          placeholder="Enter minimum ticket size"
        />
      </div>

      <div className="space-y-2">
        <Label>Capital Stack</Label>
        <Select 
          value={formData.capital_stack?.[0] || ""} 
          onValueChange={handleCapitalStackChange}
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
          value={formData.gp_capital || ""}
          onChange={(e) => updateFormData({ gp_capital: e.target.value })}
          placeholder="Enter GP capital percentage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carried_interest">Carried Interest (%)</Label>
        <Input
          id="carried_interest"
          type="number"
          step="0.01"
          value={formData.carried_interest || ""}
          onChange={(e) => updateFormData({ carried_interest: e.target.value })}
          placeholder="Enter carried interest percentage"
        />
      </div>
    </div>
  );
}