import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../RaiseFormContext";

export function DetailsStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Raise Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="Enter raise name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount</Label>
        <Input
          id="targetAmount"
          type="number"
          value={formData.targetAmount}
          onChange={(e) => updateFormData({ targetAmount: e.target.value })}
          placeholder="Enter target amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assetClass">Asset Class</Label>
        <Input
          id="assetClass"
          value={formData.assetClass}
          onChange={(e) => updateFormData({ assetClass: e.target.value })}
          placeholder="Enter asset class"
        />
      </div>
    </div>
  );
}