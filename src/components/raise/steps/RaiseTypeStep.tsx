import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RaiseTypeStepProps {
  type: "equity" | "debt";
  onTypeChange: (value: "equity" | "debt") => void;
}

export function RaiseTypeStep({ type, onTypeChange }: RaiseTypeStepProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Select Raise Type</Label>
        <RadioGroup
          value={type}
          onValueChange={onTypeChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="equity" id="equity" />
            <Label htmlFor="equity">Equity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debt" id="debt" />
            <Label htmlFor="debt">Debt</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}