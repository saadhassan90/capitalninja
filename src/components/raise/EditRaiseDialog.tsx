import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";
import { useAuth } from "@/components/AuthProvider";
import type { RaiseProject } from "./types";

interface EditRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RaiseProject;
  onUpdate: () => void;
}

export function EditRaiseDialog({ open, onOpenChange, project, onUpdate }: EditRaiseDialogProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    type: project.type as "equity" | "debt",
    category: project.category as "fund_direct_deal" | "startup",
    name: project.name,
    targetAmount: project.target_amount?.toString() || "0",
    file: null as File | null
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData(prev => ({ ...prev, file: event.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
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

      const { error } = await supabase
        .from('raises')
        .update({
          type: formData.type,
          category: formData.category,
          name: formData.name,
          target_amount: parseInt(formData.targetAmount),
          pitch_deck_url: pitchDeckUrl,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success("Raise updated successfully");
      onUpdate();
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

        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Raise Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "equity" | "debt" }))}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equity" id="edit-equity" />
                  <Label htmlFor="edit-equity">Equity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debt" id="edit-debt" />
                  <Label htmlFor="edit-debt">Debt</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as "fund_direct_deal" | "startup" }))}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fund_direct_deal" id="edit-fund" />
                  <Label htmlFor="edit-fund">Fund/Direct Deal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="startup" id="edit-startup" />
                  <Label htmlFor="edit-startup">Startup</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="raiseName">Raise Name</Label>
              <Input
                id="raiseName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter raise name"
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="Enter target amount"
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label>Update Pitch Deck (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a new pitch deck to replace the existing one.
              </p>
              <FileUploadSection
                file={formData.file}
                isProcessing={isProcessing}
                onFileChange={handleFileChange}
                onUpload={handleSubmit}
              />
              <ProgressSection
                file={formData.file}
                isProcessing={isProcessing}
                progress={uploadProgress}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}