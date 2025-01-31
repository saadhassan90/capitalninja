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
    category: "" as "fund_direct_deal" | "startup"
  });
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const progress = (step / 3) * 100;

  const handleClose = () => {
    if (formData.type || formData.category || file) {
      setShowExitDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    onOpenChange(false);
    setStep(1);
    setFormData({ type: "" as "equity" | "debt", category: "" as "fund_direct_deal" | "startup" });
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
        name: `New ${formData.type} raise`,
        pitch_deck_url: publicUrl
      }).select().single();

      if (error) throw error;

      // Process the pitch deck with OpenAI
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

  const handleNext = async () => {
    if (step === 1 && !formData.type) {
      toast.error("Please select a raise type");
      return;
    }

    if (step === 2 && !formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
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
              onFileChange={handleFileChange}
              onUpload={handleUpload}
            />
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : null}
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