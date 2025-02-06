import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { SequenceStep } from "./SequenceStep";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

interface SequenceStepsListProps {
  steps: EmailStep[];
  useAI: boolean;
  isGenerating: boolean;
  onUpdateStep: (id: number, field: keyof EmailStep, value: string | number) => void;
  onAddStep: () => void;
}

export function SequenceStepsList({
  steps,
  useAI,
  isGenerating,
  onUpdateStep,
  onAddStep
}: SequenceStepsListProps) {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Generating AI sequence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <SequenceStep
          key={step.id}
          step={step}
          useAI={useAI}
          onUpdate={onUpdateStep}
        />
      ))}

      {!useAI && steps.length < 5 && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onAddStep}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add step
        </Button>
      )}
    </div>
  );
}