import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RaisingCapitalSectionProps {
  raisingAmount: string;
  setRaisingAmount: (value: string) => void;
  raisingStage: string;
  setRaisingStage: (value: string) => void;
  raisingDescription: string;
  setRaisingDescription: (value: string) => void;
}

export function RaisingCapitalSection({
  raisingAmount,
  setRaisingAmount,
  raisingStage,
  setRaisingStage,
  raisingDescription,
  setRaisingDescription,
}: RaisingCapitalSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Raising Capital</h2>
      
      <div className="space-y-2">
        <Label htmlFor="raisingAmount">Target Amount ($)</Label>
        <Input
          id="raisingAmount"
          type="number"
          value={raisingAmount}
          onChange={(e) => setRaisingAmount(e.target.value)}
          placeholder="e.g. 1000000"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="raisingStage">Stage</Label>
        <Input
          id="raisingStage"
          value={raisingStage}
          onChange={(e) => setRaisingStage(e.target.value)}
          placeholder="e.g. Seed, Series A, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="raisingDescription">Description</Label>
        <Textarea
          id="raisingDescription"
          value={raisingDescription}
          onChange={(e) => setRaisingDescription(e.target.value)}
          rows={4}
          placeholder="Describe your fundraising goals and plans..."
        />
      </div>
    </div>
  );
}