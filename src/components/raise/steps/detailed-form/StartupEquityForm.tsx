import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRaiseForm } from "../../RaiseFormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StartupEquityForm() {
  const { formData, updateFormData } = useRaiseForm();

  const stages = [
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Series D+",
    "Growth",
    "Pre-IPO"
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="raise_name">Company Name</Label>
          <Input
            id="raise_name"
            value={formData.raise_name}
            onChange={(e) => updateFormData({ raise_name: e.target.value })}
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_raise">Funding Target</Label>
          <Input
            id="target_raise"
            type="number"
            value={formData.target_raise}
            onChange={(e) => updateFormData({ target_raise: e.target.value })}
            placeholder="Enter target amount"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Stage</Label>
        <Select 
          value={formData.raise_stage}
          onValueChange={(value) => updateFormData({ raise_stage: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="raise_description">Company Description</Label>
        <Textarea
          id="raise_description"
          value={formData.raise_description}
          onChange={(e) => updateFormData({ raise_description: e.target.value })}
          placeholder="Describe your company and what you do"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primary_contact">Primary Contact</Label>
          <Input
            id="primary_contact"
            value={formData.primary_contact}
            onChange={(e) => updateFormData({ primary_contact: e.target.value })}
            placeholder="Enter contact name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateFormData({ contact_email: e.target.value })}
            placeholder="Enter contact email"
          />
        </div>
      </div>
    </div>
  );
}