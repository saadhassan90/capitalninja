
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUMRange } from "@/types/investorFilters";
import { useState } from "react";

interface AUMRangeFilterProps {
  onAUMRangeChange: (range: AUMRange) => void;
}

export function AUMRangeFilter({ onAUMRangeChange }: AUMRangeFilterProps) {
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");

  const handleMinChange = (value: string) => {
    setMinValue(value);
    updateRange(value, maxValue);
  };

  const handleMaxChange = (value: string) => {
    setMaxValue(value);
    updateRange(minValue, value);
  };

  const updateRange = (min: string, max: string) => {
    if (min || max) {
      onAUMRangeChange({
        min: min ? Number(min) : null,
        max: max ? Number(max) : null
      });
    } else {
      onAUMRangeChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">AUM Range (in millions)</Label>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Label htmlFor="min-aum" className="text-xs text-muted-foreground">Min</Label>
          <Input
            id="min-aum"
            type="number"
            min="0"
            placeholder="0"
            value={minValue}
            onChange={(e) => handleMinChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="max-aum" className="text-xs text-muted-foreground">Max</Label>
          <Input
            id="max-aum"
            type="number"
            min="0"
            placeholder="1000000"
            value={maxValue}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
