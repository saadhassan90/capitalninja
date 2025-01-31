import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUploadSection } from "../enrichment/FileUploadSection";
import { ProgressSection } from "../enrichment/ProgressSection";

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

      const { error } = await supabase.from('raises').insert({
        user_id: user.id,
        type: formData.type,
        category: formData.category,
        name: `New ${formData.type} raise`,
        pitch_deck_url: publicUrl
      });

      if (error) throw error;

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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Raise Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value: "equity" | "debt") => 
                    setFormData({ ...formData, type: value })
                  }
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equity" id="equity" />
                    <Label htmlFor="equity">Equity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debt" id="debt" />
                    <Label htmlFor="debt">Debt</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Category</Label>
                <RadioGroup
                  value={formData.category}
                  onValueChange={(value: "fund_direct_deal" | "startup") => 
                    setFormData({ ...formData, category: value })
                  }
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fund_direct_deal" id="fund_direct_deal" />
                    <Label htmlFor="fund_direct_deal">Fund/Direct Deal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="startup" id="startup" />
                    <Label htmlFor="startup">Startup</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Upload Pitch Deck</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your pitch deck and we'll automatically create a project based on its contents.
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX
                </p>
                <FileUploadSection
                  file={file}
                  isProcessing={isProcessing}
                  onFileChange={handleFileChange}
                  onUpload={handleUpload}
                />
                <ProgressSection
                  file={file}
                  isProcessing={isProcessing}
                  progress={uploadProgress}
                />
              </div>
            </div>
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

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost if you exit now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}