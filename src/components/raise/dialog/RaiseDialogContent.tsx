import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useRaiseForm } from "../RaiseFormContext";
import { supabase } from "@/integrations/supabase/client";
import { CategoryAndTypeStep } from "../steps/CategoryAndTypeStep";
import { DetailedFormStep } from "../steps/DetailedFormStep";
import { RaiseDialogHeader } from "./RaiseDialogHeader";
import { RaiseDialogFooter } from "./RaiseDialogFooter";
import { formatDateForSupabase } from "../utils/dateUtils";

interface RaiseDialogContentProps {
  onOpenChange: (open: boolean) => void;
}

export function RaiseDialogContent({ onOpenChange }: RaiseDialogContentProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const { formData } = useRaiseForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSteps = 2;

  const isStepValid = () => {
    if (step === 1) {
      return formData.category !== "" && formData.type !== "";
    }
    return !!(
      formData.raise_name &&
      formData.target_raise &&
      formData.minimum_ticket_size &&
      formData.capital_stack?.length &&
      formData.gp_capital &&
      formData.carried_interest &&
      formData.primary_contact &&
      formData.contact_email &&
      formData.raise_description &&
      formData.city &&
      formData.state &&
      formData.country &&
      formData.assetClass &&
      formData.investment_type &&
      formData.raise_open_date &&
      formData.close_date
    );
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
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

  const generateDealMemo = async (raiseData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-deal-memo', {
        body: { raiseData }
      });

      if (error) throw error;
      return data.memo;
    } catch (error) {
      console.error('Error generating deal memo:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before creating the raise.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const insertData = {
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
        user_id: user?.id
      };

      // First insert the raise data
      const { data: raise, error: raiseError } = await supabase
        .from('raise_equity')
        .insert(insertData)
        .select()
        .single();

      if (raiseError) throw raiseError;

      // Generate the deal memo
      const memo = await generateDealMemo(raise);

      // Update the raise with the generated memo
      const { error: updateError } = await supabase
        .from('raise_equity')
        .update({ memo })
        .eq('id', raise.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Raise created successfully with deal memo",
      });
      handleClose();
    } catch (error: any) {
      console.error('Error creating raise:', error);
      toast({
        title: "Error",
        description: "Failed to create raise",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStep = () => {
    switch (step) {
      case 1:
        return <CategoryAndTypeStep />;
      case 2:
        return <DetailedFormStep />;
      default:
        return null;
    }
  };

  return (
    <>
      <RaiseDialogHeader step={step} totalSteps={totalSteps} />

      <ScrollArea className="flex-1 px-6">
        <div className="py-4">
          {getCurrentStep()}
        </div>
      </ScrollArea>

      <RaiseDialogFooter
        step={step}
        totalSteps={totalSteps}
        isStepValid={isStepValid()}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </>
  );
}