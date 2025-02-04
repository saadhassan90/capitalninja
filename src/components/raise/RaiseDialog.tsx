import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CategoryStep } from "./steps/CategoryStep";
import { TypeStep } from "./steps/TypeStep";
import { DetailsStep } from "./steps/DetailsStep";
import { DetailedFormStep } from "./steps/DetailedFormStep";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RaiseFormProvider, useRaiseForm } from "./RaiseFormContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RaiseDialogContent({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const { formData } = useRaiseForm();
  
  const totalSteps = 4;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setStep(1);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('raise_equity')
        .insert({
          raise_name: formData.raise_name,
          target_raise: parseFloat(formData.target_raise),
          asset_classes: formData.asset_classes,
          investment_type: formData.investment_type,
          geographic_focus: formData.geographic_focus,
          raise_stage: formData.raise_stage,
          raise_open_date: formData.raise_open_date,
          close_date: formData.close_date,
          first_close: formData.first_close,
          minimum_ticket_size: parseFloat(formData.minimum_ticket_size),
          capital_stack: formData.capital_stack,
          gp_capital: formData.gp_capital ? parseFloat(formData.gp_capital) : null,
          carried_interest: formData.carried_interest ? parseFloat(formData.carried_interest) : null,
          irr_projections: formData.irr_projections ? parseFloat(formData.irr_projections) : null,
          equity_multiple: formData.equity_multiple ? parseFloat(formData.equity_multiple) : null,
          preferred_returns_hurdle: formData.preferred_returns_hurdle ? parseFloat(formData.preferred_returns_hurdle) : null,
          asset_management_fee: formData.asset_management_fee ? parseFloat(formData.asset_management_fee) : null,
          asset_management_fees_type: formData.asset_management_fees_type,
          additional_fees: formData.additional_fees,
          tax_incentives: formData.tax_incentives,
          domicile: formData.domicile,
          strategy: formData.strategy,
          economic_drivers: formData.economic_drivers,
          risks: formData.risks,
          reups: formData.reups ? parseInt(formData.reups) : null,
          audience: formData.audience,
          primary_contact: formData.primary_contact,
          contact_email: formData.contact_email,
          company_contact: formData.company_contact,
          raise_description: formData.raise_description,
          banner: formData.banner,
          term_lockup: formData.term_lockup ? parseInt(formData.term_lockup) : null,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Raise created successfully",
      });
      handleClose();
    } catch (error) {
      console.error('Error creating raise:', error);
      toast({
        title: "Error",
        description: "Failed to create raise",
        variant: "destructive",
      });
    }
  };

  const getCurrentStep = () => {
    switch (step) {
      case 1:
        return <CategoryStep />;
      case 2:
        return <TypeStep />;
      case 3:
        return <DetailsStep />;
      case 4:
        return <DetailedFormStep />;
      default:
        return null;
    }
  };

  return (
    <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Create New Raise</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Set up your fundraising project in just a few steps
        </p>
      </DialogHeader>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-2">
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground mt-2">
            Step {step} of {totalSteps}
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4">
            {getCurrentStep()}
          </div>
        </ScrollArea>

        <div className="flex justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={handleNext} className="gap-2">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Create Raise
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export function RaiseDialog(props: RaiseDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <RaiseFormProvider>
        <RaiseDialogContent onOpenChange={props.onOpenChange} />
      </RaiseFormProvider>
    </Dialog>
  );
}