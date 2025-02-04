import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useRaiseForm } from "../../RaiseFormContext";

const capitalStackOptions = [
  "General Partner",
  "Limited Partner",
  "Syndication",
  "Co-Investor",
];

export function FinancialDetailsSection() {
  const { formData, updateFormData } = useRaiseForm();

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
        <MultiSelect
          options={capitalStackOptions}
          selected={formData.capital_stack || []}
          onChange={(value) => updateFormData({ capital_stack: value })}
          placeholder="Select capital stack positions"
        />
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