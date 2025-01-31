import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import type { RaiseProject } from "../types";
import { EditRaiseForm, type EditFormData } from "./EditRaiseForm";

interface EditRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RaiseProject;
  onSave?: () => void;
}

export function EditRaiseDialog({ open, onOpenChange, project, onSave }: EditRaiseDialogProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<EditFormData>({
    type: project.type as "equity" | "debt",
    category: project.category as "fund_direct_deal" | "startup",
    name: project.name,
    targetAmount: project.target_amount.toString(),
    file: null
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData(prev => ({ ...prev, file: event.target.files![0] }));
    }
  };

  const handleFormDataChange = (data: Partial<EditFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to update a raise");
      return;
    }

    if (!formData.name || !formData.targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      let pitchDeckUrl = project.pitch_deck_url;

      if (formData.file) {
        const fileExt = formData.file.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('pitch_decks')
          .upload(filePath, formData.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('pitch_decks')
          .getPublicUrl(filePath);

        pitchDeckUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('raises')
        .update({
          type: formData.type,
          category: formData.category,
          name: formData.name,
          target_amount: parseInt(formData.targetAmount),
          pitch_deck_url: pitchDeckUrl,
        })
        .eq('id', project.id);

      if (updateError) throw updateError;

      toast.success("Raise updated successfully");
      onSave?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update raise");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Raise</DialogTitle>
        </DialogHeader>

        <EditRaiseForm
          project={project}
          isProcessing={isProcessing}
          uploadProgress={uploadProgress}
          onFileChange={handleFileChange}
          onFormDataChange={handleFormDataChange}
          formData={formData}
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}