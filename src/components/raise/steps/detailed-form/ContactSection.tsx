import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRaiseForm } from "../../RaiseFormContext";

export function ContactSection() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primary_contact">Primary Contact</Label>
          <Input
            id="primary_contact"
            value={formData.primary_contact || ""}
            onChange={(e) => updateFormData({ primary_contact: e.target.value })}
            placeholder="Enter primary contact name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email || ""}
            onChange={(e) => updateFormData({ contact_email: e.target.value })}
            placeholder="Enter contact email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="raise_description">Raise Description</Label>
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