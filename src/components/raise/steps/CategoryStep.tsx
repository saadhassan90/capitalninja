import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CategoryStepProps {
  category: "fund_direct_deal" | "startup";
  onCategoryChange: (value: "fund_direct_deal" | "startup") => void;
}

export function CategoryStep({ category, onCategoryChange }: CategoryStepProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Select Category</Label>
        <RadioGroup
          value={category}
          onValueChange={onCategoryChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fund_direct_deal" id="fund_direct_deal" />
            <Label htmlFor="fund_direct_deal">Fund/Direct Deal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <Label htmlFor="startup">Startup</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}