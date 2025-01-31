import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../RaiseFormContext";

export function RaiseTypeStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Select Raise Type</Label>
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
            <RadioGroupItem value="debt" id="debt" />
            <Label htmlFor="debt">Debt</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}