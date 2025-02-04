import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RaiseDialogFooterProps {
  step: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function RaiseDialogFooter({ 
  step, 
  totalSteps, 
  isStepValid,
  isSubmitting,
  onBack,
  onNext,
  onSubmit
}: RaiseDialogFooterProps) {
  return (
    <div className="flex justify-between p-6 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </Button>
      
      {step < totalSteps ? (
        <Button 
          onClick={onNext} 
          className="gap-2"
          disabled={!isStepValid}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit}
          disabled={!isStepValid || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Raise"}
        </Button>
      )}
    </div>
  );
}