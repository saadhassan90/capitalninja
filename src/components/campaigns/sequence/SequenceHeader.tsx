import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye, Save, Sparkle } from "lucide-react";

interface SequenceHeaderProps {
  useAI: boolean;
  onAIToggle: (checked: boolean) => void;
  onPreview: () => void;
  onSave: () => void;
}

export function SequenceHeader({ useAI, onAIToggle, onPreview, onSave }: SequenceHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Email Sequence</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={useAI}
            onCheckedChange={onAIToggle}
            id="ai-mode"
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#1EAEDB] data-[state=checked]:to-[#8B5CF6]"
          />
          <label
            htmlFor="ai-mode"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] bg-clip-text text-transparent">
              Personalize using AI
            </span>
            <Sparkle className="h-4 w-4 text-[#1EAEDB]" />
          </label>
        </div>
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Sequence
        </Button>
      </div>
    </div>
  );
}