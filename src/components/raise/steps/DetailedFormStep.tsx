import { useRaiseForm } from "../RaiseFormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { MultiSelect } from "@/components/ui/multi-select";

const assetClassOptions = [
  "Real Estate",
  "Private Equity",
  "Venture Capital",
  "Infrastructure",
  "Private Debt",
  "Hedge Funds",
];

const geographicOptions = [
  "North America",
  "Europe",
  "Asia",
  "Latin America",
  "Middle East",
  "Africa",
];

const stageOptions = [
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Growth",
  "Late Stage",
];

const capitalStackOptions = [
  "Senior Debt",
  "Mezzanine Debt",
  "Preferred Equity",
  "Common Equity",
];

const audienceOptions = [
  "Family Offices",
  "Institutional Investors",
  "High Net Worth Individuals",
  "Pension Funds",
  "Endowments",
  "Fund of Funds",
];

export function DetailedFormStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-6">
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

        <div className="space-y-2">
          <Label>Asset Classes</Label>
          <MultiSelect
            options={assetClassOptions}
            selected={formData.asset_classes || []}
            onChange={(value) => updateFormData({ asset_classes: value })}
            placeholder="Select asset classes"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment_type">Investment Type</Label>
          <Input
            id="investment_type"
            value={formData.investment_type || ""}
            onChange={(e) => updateFormData({ investment_type: e.target.value })}
            placeholder="Direct or Indirect"
          />
        </div>

        <div className="space-y-2">
          <Label>Geographic Focus</Label>
          <MultiSelect
            options={geographicOptions}
            selected={formData.geographic_focus || []}
            onChange={(value) => updateFormData({ geographic_focus: value })}
            placeholder="Select regions"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="raise_stage">Raise Stage</Label>
          <select
            id="raise_stage"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.raise_stage || ""}
            onChange={(e) => updateFormData({ raise_stage: e.target.value })}
          >
            <option value="">Select stage</option>
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Raise Open Date</Label>
          <DatePicker
            date={formData.raise_open_date}
            onSelect={(date) => updateFormData({ raise_open_date: date })}
          />
        </div>

        <div className="space-y-2">
          <Label>Close Date</Label>
          <DatePicker
            date={formData.close_date}
            onSelect={(date) => updateFormData({ close_date: date })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum_ticket_size">Minimum Ticket Size</Label>
          <Input
            id="minimum_ticket_size"
            type="number"
            value={formData.minimum_ticket_size || ""}
            onChange={(e) => updateFormData({ minimum_ticket_size: e.target.value })}
            placeholder="Enter minimum ticket size"
          />
        </div>

        <div className="space-y-2">
          <Label>Capital Stack</Label>
          <MultiSelect
            options={capitalStackOptions}
            selected={formData.capital_stack || []}
            onChange={(value) => updateFormData({ capital_stack: value })}
            placeholder="Select capital stack positions"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gp_capital">GP Capital (%)</Label>
          <Input
            id="gp_capital"
            type="number"
            step="0.01"
            value={formData.gp_capital || ""}
            onChange={(e) => updateFormData({ gp_capital: e.target.value })}
            placeholder="Enter GP capital percentage"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carried_interest">Carried Interest (%)</Label>
          <Input
            id="carried_interest"
            type="number"
            step="0.01"
            value={formData.carried_interest || ""}
            onChange={(e) => updateFormData({ carried_interest: e.target.value })}
            placeholder="Enter carried interest percentage"
          />
        </div>

        <div className="space-y-2">
          <Label>Target Audience</Label>
          <MultiSelect
            options={audienceOptions}
            selected={formData.audience || []}
            onChange={(value) => updateFormData({ audience: value })}
            placeholder="Select target audience"
          />
        </div>

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