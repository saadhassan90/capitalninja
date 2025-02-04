import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../RaiseFormContext";

export function TypeStep() {
  const { formData, updateFormData } = useRaiseForm();

  const isDebtDisabled = formData.category === "startup" || formData.category === "fund_direct_deal";

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Select Type</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value) => updateFormData({ type: value as "equity" | "debt" })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="equity" id="equity" />
            <Label htmlFor="equity">Equity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debt" id="debt" disabled={isDebtDisabled} />
            <Label 
              htmlFor="debt" 
              className={isDebtDisabled ? "text-gray-400" : ""}
            >
              Debt {isDebtDisabled && "(Coming Soon)"}
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}