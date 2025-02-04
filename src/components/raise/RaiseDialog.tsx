import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CategoryStep } from "./steps/CategoryStep";
import { TypeStep } from "./steps/TypeStep";
import { DetailedFormStep } from "./steps/DetailedFormStep";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RaiseFormProvider, useRaiseForm } from "./RaiseFormContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateForSupabase } from "./utils/dateUtils";

interface RaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RaiseDialogContent({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const { formData } = useRaiseForm();
  
  const totalSteps = 3; // Reduced from 4 to 3
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

  const prepareInsertData = () => {
    if (!user) return null;

    return {
      additional_fees: formData.additional_fees || null,
      asset_classes: formData.asset_classes,
      asset_management_fee: formData.asset_management_fee ? parseFloat(formData.asset_management_fee) : null,
      asset_management_fees_type: formData.asset_management_fees_type || null,
      audience: formData.audience,
      banner: formData.banner || null,
      capital_stack: formData.capital_stack,
      carried_interest: formData.carried_interest ? parseFloat(formData.carried_interest) : null,
      close_date: formData.close_date ? formatDateForSupabase(formData.close_date) : null,
      company_contact: formData.company_contact || null,
      contact_email: formData.contact_email,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      domicile: formData.domicile || null,
      economic_drivers: formData.economic_drivers || [],
      equity_multiple: formData.equity_multiple ? parseFloat(formData.equity_multiple) : null,
      first_close: formData.first_close ? formatDateForSupabase(formData.first_close) : null,
      gp_capital: formData.gp_capital ? parseFloat(formData.gp_capital) : null,
      investment_type: formData.investment_type,
      irr_projections: formData.irr_projections ? parseFloat(formData.irr_projections) : null,
      minimum_ticket_size: formData.minimum_ticket_size ? parseFloat(formData.minimum_ticket_size) : 0,
      preferred_returns_hurdle: formData.preferred_returns_hurdle ? parseFloat(formData.preferred_returns_hurdle) : null,
      primary_contact: formData.primary_contact,
      raise_description: formData.raise_description,
      raise_name: formData.raise_name,
      raise_open_date: formData.raise_open_date ? formatDateForSupabase(formData.raise_open_date) : null,
      raise_stage: formData.raise_stage,
      reups: formData.reups ? parseInt(formData.reups) : null,
      risks: formData.risks || [],
      strategy: formData.strategy || [],
      target_raise: formData.target_raise ? parseFloat(formData.target_raise) : 0,
      tax_incentives: formData.tax_incentives || null,
      term_lockup: formData.term_lockup ? parseInt(formData.term_lockup) : null,
      user_id: user.id
    };
  };

  const handleSubmit = async () => {
    const insertData = prepareInsertData();
    if (!insertData) return;

    try {
      const { error } = await supabase
        .from('raise_equity')
        .insert(insertData);

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
        return <DetailedFormStep />;
      default:
        return null;
    }
  };

  return (
    <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Create New Raise</DialogTitle>
        <p className="text-sm text-muted-foreground mt-2">
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