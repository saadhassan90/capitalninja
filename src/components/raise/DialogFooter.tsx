import { Button } from "@/components/ui/button";
import { useRaiseForm } from "./RaiseFormContext";

export function DialogFooter() {
  const { 
    step, 
    isProcessing, 
    handleClose, 
    handleBack, 
    handleNext, 
    handleUpload,
    isStepValid 
  } = useRaiseForm();

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
          disabled={!isStepValid() || isProcessing}
          variant="default"
        >
          {isProcessing ? "Processing..." : "Finish"}
        </Button>
      )}
    </div>
  );
}