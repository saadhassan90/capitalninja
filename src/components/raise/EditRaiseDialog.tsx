import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import type { RaiseProject } from "./types";
import { RaiseDialogHeader } from "./dialog/RaiseDialogHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetailedFormStep } from "./steps/DetailedFormStep";
import { useRaiseForm } from "./RaiseFormContext";

interface EditRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RaiseProject;
  onUpdate?: () => void;
  readOnly?: boolean;
}

export function EditRaiseDialog({ 
  open, 
  onOpenChange, 
  project,
  onUpdate,
  readOnly = false
}: EditRaiseDialogProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { formData, updateFormData } = useRaiseForm();

  // Initialize form data with project values when dialog opens
  useState(() => {
    if (open) {
      updateFormData({
        raise_name: project.name,
        target_raise: project.target_amount?.toString() || "",
        type: project.type as "equity" | "debt",
        category: project.category as "fund_direct_deal" | "startup"
      });
    }
  });

  const handleSave = async () => {
    if (!user) return;

    setIsProcessing(true);

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

      const { error } = await supabase
        .from('raises')
        .update({
          name: formData.raise_name,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
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
      </DialogContent>
    </Dialog>
  );
}