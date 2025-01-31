import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ExitDialog } from "./ExitDialog";
import { RaiseFormProvider, useRaiseForm } from "./RaiseFormContext";
import { DialogFooter } from "./DialogFooter";
import { RaiseTypeStep } from "./steps/RaiseTypeStep";
import { CategoryStep } from "./steps/CategoryStep";
import { PitchDeckStep } from "./steps/PitchDeckStep";

interface CreateRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRaise?: () => void;
}

function CreateRaiseDialogContent() {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { step, formData, handleClose, handleExitConfirm } = useRaiseForm();

  const progress = (step / 3) * 100;

  const handleDialogClose = () => {
    if (formData.type || formData.category || formData.file || formData.name || formData.targetAmount || formData.raisedAmount) {
      setShowExitDialog(true);
    } else {
      handleClose();
    }
  };

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Raise</DialogTitle>
        </DialogHeader>
        
        <Progress value={progress} className="mt-2" />
        
        {step === 1 && <RaiseTypeStep />}
        {step === 2 && <CategoryStep />}
        {step === 3 && <PitchDeckStep />}

        <DialogFooter />
      </DialogContent>

      <ExitDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={handleExitConfirm}
      />
    </>
  );
}

export function CreateRaiseDialog({ open, onOpenChange, onCreateRaise }: CreateRaiseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <RaiseFormProvider onOpenChange={onOpenChange} onCreateRaise={onCreateRaise}>
        <CreateRaiseDialogContent />
      </RaiseFormProvider>
    </Dialog>
  );
}