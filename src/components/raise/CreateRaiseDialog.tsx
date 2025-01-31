import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RaiseTypeStep } from "./steps/RaiseTypeStep";
import { CategoryStep } from "./steps/CategoryStep";
import { PitchDeckStep } from "./steps/PitchDeckStep";
import { ExitDialog } from "./ExitDialog";

interface CreateRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRaise?: () => void;
}

export function CreateRaiseDialog({ open, onOpenChange, onCreateRaise }: CreateRaiseDialogProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [formData, setFormData] = useState({
    type: "" as "equity" | "debt",
    category: "" as "fund_direct_deal" | "startup",
    name: "",
    targetAmount: "",
    raisedAmount: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const progress = (step / 3) * 100;

  const handleClose = () => {
    if (formData.type || formData.category || file || formData.name || formData.targetAmount || formData.raisedAmount) {
      setShowExitDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    onOpenChange(false);
    setStep(1);
    setFormData({
      type: "" as "equity" | "debt",
      category: "" as "fund_direct_deal" | "startup",
      name: "",
      targetAmount: "",
      raisedAmount: "",
    });
    setFile(null);
    setIsProcessing(false);
    setUploadProgress(0);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    if (!formData.name) {
      toast.error("Please enter a raise name");
      return;
    }

    if (!formData.targetAmount) {
      toast.error("Please enter a target amount");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('pitch_decks')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pitch_decks')
        .getPublicUrl(filePath);

      const { data: raise, error } = await supabase.from('raises').insert({
        user_id: user.id,
        type: formData.type,
        category: formData.category,
        name: formData.name,
        target_amount: parseInt(formData.targetAmount),
        pitch_deck_url: publicUrl
      }).select().single();

      if (error) throw error;

      const { error: processError } = await supabase.functions.invoke('process-pitch-deck', {
        body: { raiseId: raise.id, fileUrl: publicUrl }
      });

      if (processError) throw processError;

      toast.success("Raise created successfully");
      onCreateRaise?.();
      handleExitConfirm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create raise");
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.category;
      case 3:
        return !!formData.name && !!formData.targetAmount && !!file;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!isStepValid()) {
      if (step === 1) {
        toast.error("Please select a raise type");
      } else if (step === 2) {
        toast.error("Please select a category");
      }
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Raise</DialogTitle>
          </DialogHeader>
          
          <Progress value={progress} className="mt-2" />
          
          {step === 1 && (
            <RaiseTypeStep
              type={formData.type}
              onTypeChange={(value) => setFormData({ ...formData, type: value })}
            />
          )}

          {step === 2 && (
            <CategoryStep
              category={formData.category}
              onCategoryChange={(value) => setFormData({ ...formData, category: value })}
            />
          )}

          {step === 3 && (
            <PitchDeckStep
              file={file}
              isProcessing={isProcessing}
              uploadProgress={uploadProgress}
              raiseName={formData.name}
              targetAmount={formData.targetAmount}
              raisedAmount={formData.raisedAmount}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              onRaiseNameChange={(value) => setFormData({ ...formData, name: value })}
              onTargetAmountChange={(value) => setFormData({ ...formData, targetAmount: value })}
              onRaisedAmountChange={(value) => setFormData({ ...formData, raisedAmount: value })}
            />
          )}

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
        </DialogContent>
      </Dialog>

      <ExitDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={handleExitConfirm}
      />
    </>
  );
}