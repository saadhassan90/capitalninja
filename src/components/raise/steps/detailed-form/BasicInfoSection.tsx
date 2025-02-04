import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSectionProps {
  formData: {
    raise_name: string;
    raise_description: string;
    target_raise: string;
    primary_contact: string;
    contact_email: string;
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

      <div className="space-y-2">
        <Label htmlFor="primary_contact">Primary Contact</Label>
        <Input
          id="primary_contact"
          value={formData.primary_contact}
          onChange={(e) => onChange({ primary_contact: e.target.value })}
          placeholder="Enter primary contact name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) => onChange({ contact_email: e.target.value })}
          placeholder="Enter contact email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="raise_description">Description</Label>
        <Textarea
          id="raise_description"
          value={formData.raise_description}
          onChange={(e) => onChange({ raise_description: e.target.value })}
          placeholder="Enter raise description"
          rows={4}
        />
      </div>
    </div>
  );
}