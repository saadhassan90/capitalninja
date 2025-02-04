import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RaiseProject } from "./types";
import { RaiseDialogHeader } from "./dialog/RaiseDialogHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetailedFormStep } from "./steps/DetailedFormStep";
import { RaiseFormProvider, useRaiseForm } from "./RaiseFormContext";
import type { RaiseType, RaiseCategory } from "./types/raiseTypes";
import { uploadPitchDeck } from "./services/fileUploadService";

interface EditRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RaiseProject;
  onUpdate?: () => void;
  readOnly?: boolean;
}

function EditRaiseDialogContent({ 
  project,
  onOpenChange,
  onUpdate,
  readOnly = false
}: Omit<EditRaiseDialogProps, 'open'>) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { formData, updateFormData } = useRaiseForm();

  useEffect(() => {
    if (project) {
      const projectType = project.type as RaiseType;
      const projectCategory = project.category as RaiseCategory;
      
      updateFormData({
        type: projectType,
        category: projectCategory,
        raise_name: project.name,
        target_raise: project.target_amount?.toString() || "",
        raise_description: project.description || "",
        memo: project.memo || null,
        asset_classes: [],
        investment_type: "",
        city: "",
        state: "",
        country: "",
        raise_stage: "",
        minimum_ticket_size: "",
        capital_stack: [],
        gp_capital: "",
        carried_interest: "",
        irr_projections: "",
        equity_multiple: "",
        preferred_returns_hurdle: "",
        asset_management_fee: "",
        asset_management_fees_type: "",
        additional_fees: "",
        tax_incentives: "",
        domicile: "",
        strategy: [],
        economic_drivers: [],
        risks: [],
        reups: "",
        audience: [],
        primary_contact: "",
        contact_email: "",
        company_contact: "",
        banner: "",
        term_lockup: "",
        file: null
      });
    }
  }, [project, updateFormData]);

  const handleSave = async () => {
    if (!user) return;

    setIsProcessing(true);

    try {
      let pitchDeckUrl = project.pitch_deck_url;

      if (formData.file) {
        pitchDeckUrl = await uploadPitchDeck(formData.file, user.id);
      }

      const { error } = await supabase
        .from('raises')
        .update({
          name: formData.raise_name,
          type: formData.type as RaiseType,
          category: formData.category as RaiseCategory,
          description: formData.raise_description,
          target_amount: parseInt(formData.target_raise),
          pitch_deck_url: pitchDeckUrl,
          memo: formData.memo
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success("Raise updated successfully");
      onUpdate?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update raise");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <RaiseDialogHeader step={1} totalSteps={1} />
      
      <ScrollArea className="flex-1 px-6">
        <div className="py-4">
          <DetailedFormStep />
        </div>
      </ScrollArea>

      <div className="flex justify-end p-6 border-t">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="mr-2"
        >
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly && (
          <Button
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </>
  );
}

export function EditRaiseDialog(props: EditRaiseDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
        <RaiseFormProvider>
          <EditRaiseDialogContent {...props} />
        </RaiseFormProvider>
      </DialogContent>
    </Dialog>
  );
}