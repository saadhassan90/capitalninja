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
    raise_name: project.name,
    raise_description: project.description || '',
    target_raise: project.target_amount?.toString() || '',
    primary_contact: '',
    contact_email: '',
  });

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to update a raise");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('raise_equity')
        .update({
          raise_name: formData.raise_name,
          raise_description: formData.raise_description,
          target_raise: parseFloat(formData.target_raise),
          primary_contact: formData.primary_contact,
          contact_email: formData.contact_email,
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