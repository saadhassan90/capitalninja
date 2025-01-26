import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { AUMRange } from "@/types/investorFilters";

interface AUMRangeFilterProps {
  onAUMRangeChange: (range: AUMRange) => void;
}

export function AUMRangeFilter({ onAUMRangeChange }: AUMRangeFilterProps) {
  const maxAUM = 1000; // $1T
  const defaultAUMRange = [0, maxAUM];

  const formatAUM = (value: number) => {
    if (value >= 1000) return `$${value/1000}T`;
    return `$${value}B`;
  };

  return (
    <div className="space-y-2 max-w-xl">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-900">AUM Range</Label>
        <div className="text-sm text-muted-foreground">
          {formatAUM(defaultAUMRange[0])} - {formatAUM(defaultAUMRange[1])}
        </div>
      </div>
      <Slider
        defaultValue={defaultAUMRange}
        max={maxAUM}
        step={10}
        onValueChange={(value) => onAUMRangeChange(value as [number, number])}
        className="w-full"
      />
    </div>
  );
}