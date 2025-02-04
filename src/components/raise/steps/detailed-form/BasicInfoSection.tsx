import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSectionProps {
  formData: {
    name: string;
    description: string;
    target_amount: string;
  };
  onChange: (data: Partial<{
    name: string;
    description: string;
    target_amount: string;
  }>) => void;
}

export function BasicInfoSection({ formData, onChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="raise_name">Raise Name</Label>
        <Input
          id="raise_name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter raise name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_amount">Target Amount</Label>
        <Input
          id="target_amount"
          type="number"
          value={formData.target_amount}
          onChange={(e) => onChange({ target_amount: e.target.value })}
          placeholder="Enter target amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Enter raise description"
          rows={4}
        />
      </div>
    </div>
  );
}