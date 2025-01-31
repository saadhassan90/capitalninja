import { Button } from "@/components/ui/button";
import { useRaiseForm } from "./RaiseFormContext";

export function DialogFooter() {
  const { 
    step, 
    isProcessing,
    memoStatus, 
    handleClose, 
    handleBack, 
    handleNext, 
    handleUpload,
    isStepValid 
  } = useRaiseForm();

  const canFinish = step === 3 && isStepValid() && memoStatus === 'complete';

  return (
    <div className="flex justify-between mt-6">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleClose}
        >
          Cancel
        </Button>
        {step > 1 && (
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>
        )}
      </div>
      {step < 3 ? (
        <Button 
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          Next
        </Button>
      ) : (
        <Button 
          onClick={handleUpload}
          disabled={!canFinish || isProcessing}
          variant="default"
        >
          {isProcessing ? "Processing..." : "Finish"}
        </Button>
      )}
    </div>
  );
}