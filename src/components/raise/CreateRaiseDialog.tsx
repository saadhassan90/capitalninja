import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const handleClose = () => {
    if (formData.type || formData.category) {
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
  };

  const handleNext = async () => {
    if (step === 1 && !formData.type) {
      toast.error("Please select a raise type");
      return;
    }

    if (step === 2) {
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }

      try {
        const { error } = await supabase.from('raises').insert({
          user_id: user?.id,
          type: formData.type,
          category: formData.category,
          name: `New ${formData.type} raise`,
        });

        if (error) throw error;

        toast.success("Raise created successfully");
        onCreateRaise?.();
        handleExitConfirm();
      } catch (error: any) {
        toast.error(error.message || "Failed to create raise");
      }
    } else {
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

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button onClick={handleNext}>
              {step === 2 ? "Create" : "Next"}
            </Button>
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