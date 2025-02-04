import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  formData: {
    raise_name: string;
    target_raise: string;
  };
  onChange: (data: Partial<BasicInfoSectionProps['formData']>) => void;
}

export function BasicInfoSection({ formData, onChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="raise_name">Raise Name</Label>
        <Input
          id="raise_name"
          value={formData.raise_name}
          onChange={(e) => onChange({ raise_name: e.target.value })}
          placeholder="Enter raise name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_raise">Target Amount</Label>
        <Input
          id="target_raise"
          type="number"
          value={formData.target_raise}
          onChange={(e) => onChange({ target_raise: e.target.value })}
          placeholder="Enter target amount"
        />
      </div>
    </div>
  );
}