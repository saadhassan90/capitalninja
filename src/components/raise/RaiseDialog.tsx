import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CategoryStep } from "./steps/CategoryStep";
import { TypeStep } from "./steps/TypeStep";
import { DetailsStep } from "./steps/DetailsStep";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RaiseFormProvider } from "./RaiseFormContext";

interface RaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RaiseDialog({ open, onOpenChange }: RaiseDialogProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setStep(1);
    onOpenChange(false);
  };

  const getCurrentStep = () => {
    switch (step) {
      case 1:
        return <CategoryStep />;
      case 2:
        return <TypeStep />;
      case 3:
        return <DetailsStep />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Raise</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set up your fundraising project in just a few steps
          </p>
        </DialogHeader>

        <RaiseFormProvider>
          <div className="space-y-6">
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </div>
            </div>

            {getCurrentStep()}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              
              {step < totalSteps ? (
                <Button onClick={handleNext} className="gap-2">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => {
                  toast({
                    title: "Success",
                    description: "Raise created successfully",
                  });
                  handleClose();
                }}>
                  Create Raise
                </Button>
              )}
            </div>
          </div>
        </RaiseFormProvider>
      </DialogContent>
    </Dialog>
  );
}