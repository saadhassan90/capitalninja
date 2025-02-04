import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../RaiseFormContext";

export function DetailsStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="raise_name">Raise Name</Label>
        <Input
          id="raise_name"
          value={formData.raise_name || ""}
          onChange={(e) => updateFormData({ raise_name: e.target.value })}
          placeholder="Enter raise name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_raise">Target Amount</Label>
        <Input
          id="target_raise"
          type="number"
          value={formData.target_raise || ""}
          onChange={(e) => updateFormData({ target_raise: e.target.value })}
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