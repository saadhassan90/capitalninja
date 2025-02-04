import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRaiseForm } from "../../RaiseFormContext";

export function BasicInfoSection() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="grid grid-cols-2 gap-4">
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
        <Label htmlFor="target_raise">Target Raise Amount</Label>
        <Input
          id="target_raise"
          type="number"
          value={formData.target_raise || ""}
          onChange={(e) => updateFormData({ target_raise: e.target.value })}
          placeholder="Enter target amount"
        />
      </div>
    </div>
  );
}