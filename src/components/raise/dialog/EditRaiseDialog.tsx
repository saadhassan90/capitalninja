import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RaiseFormProvider } from "../RaiseFormContext";
import { RaiseDialogHeader } from "./RaiseDialogHeader";
import { RaiseDialogFooter } from "./RaiseDialogFooter";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoSection } from "../steps/detailed-form/BasicInfoSection";
import type { RaiseProject } from "../types";

interface EditRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RaiseProject;
  onUpdate?: () => void;
}

export function EditRaiseDialog({ open, onOpenChange, project, onUpdate }: EditRaiseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    target_amount: project.target_amount.toString(),
    type: project.type,
    category: project.category,
    status: project.status,
    pitch_deck_url: project.pitch_deck_url || '',
  });

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to update a raise");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('raises')
        .update({
          name: formData.name,
          description: formData.description,
          target_amount: parseFloat(formData.target_amount),
          type: formData.type,
          category: formData.category,
          status: formData.status,
          pitch_deck_url: formData.pitch_deck_url || null,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success("Raise updated successfully");
      onUpdate?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating raise:', error);
      toast.error(error.message || "Failed to update raise");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
        <RaiseFormProvider>
          <RaiseDialogHeader step={1} totalSteps={1} />
          
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <BasicInfoSection
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          </div>

          <RaiseDialogFooter
            step={1}
            totalSteps={1}
            isStepValid={true}
            isSubmitting={isSubmitting}
            onBack={() => {}}
            onNext={() => {}}
            onSubmit={handleSubmit}
            submitText="Save"
          />
        </RaiseFormProvider>
      </DialogContent>
    </Dialog>
  );
}