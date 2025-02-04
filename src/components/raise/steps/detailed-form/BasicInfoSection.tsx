import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRaiseForm } from "../../RaiseFormContext";

export function BasicInfoSection() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="raise_description">Description</Label>
        <Textarea
          id="raise_description"
          value={formData.raise_description || ""}
          onChange={(e) => updateFormData({ raise_description: e.target.value })}
          placeholder="Enter raise description"
          rows={4}
        />
      </div>
    </div>
  );
}