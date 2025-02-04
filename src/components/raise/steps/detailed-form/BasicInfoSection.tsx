import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoSectionProps {
  formData: {
    name: string;
    description: string;
    target_amount: string;
    type: "equity" | "debt" | "";
    category: "fund_direct_deal" | "startup" | "";
    status: string;
    pitch_deck_url?: string;
  };
  onChange: (data: Partial<BasicInfoSectionProps['formData']>) => void;
}

export function BasicInfoSection({ formData, onChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Raise Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter raise name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={(value) => onChange({ type: value as "equity" | "debt" })}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equity">Equity</SelectItem>
            <SelectItem value="debt">Debt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => onChange({ category: value as "fund_direct_deal" | "startup" })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fund_direct_deal">Fund/Direct Deal</SelectItem>
            <SelectItem value="startup">Startup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => onChange({ status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
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

      <div className="space-y-2">
        <Label htmlFor="pitch_deck_url">Pitch Deck URL</Label>
        <Input
          id="pitch_deck_url"
          value={formData.pitch_deck_url}
          onChange={(e) => onChange({ pitch_deck_url: e.target.value })}
          placeholder="Enter pitch deck URL"
        />
      </div>
    </div>
  );
}