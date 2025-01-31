import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../RaiseFormContext";

export function CategoryStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Select Category</Label>
        <RadioGroup
          value={formData.category}
          onValueChange={(value) => updateFormData({ category: value as "fund_direct_deal" | "startup" })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fund_direct_deal" id="fund_direct_deal" />
            <Label htmlFor="fund_direct_deal">Fund/Direct Deal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <Label htmlFor="startup">Startup</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}