import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { useRaiseForm } from "../RaiseFormContext";
import { CategoryAndTypeStep } from "../steps/CategoryAndTypeStep";
import { DetailedFormStep } from "../steps/DetailedFormStep";
import { RaiseDialogHeader } from "./RaiseDialogHeader";
import { RaiseDialogFooter } from "./RaiseDialogFooter";
import { submitRaiseForm } from "../services/raiseSubmissionService";

interface RaiseDialogContentProps {
  onOpenChange: (open: boolean) => void;
}

export function RaiseDialogContent({ onOpenChange }: RaiseDialogContentProps) {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { formData, resetForm } = useRaiseForm();
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
      formData.investment_type
    );
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast.error("Please fill in all required fields before proceeding.");
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
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      toast.error("Please fill in all required fields before creating the raise.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a raise.");
      return;
    }

    if (formData.type !== "equity" && formData.type !== "debt") {
      toast.error("Please select a valid investment type.");
      return;
    }

    if (formData.category !== "fund_direct_deal" && formData.category !== "startup") {
      toast.error("Please select a valid category.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitRaiseForm(formData, user.id);
      toast.success("Raise created successfully");
      handleClose();
    } catch (error: any) {
      console.error('Error creating raise:', error);
      toast.error(error.message || "Failed to create raise");
    } finally {
      setIsSubmitting(false);
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

  function getCurrentStep() {
    switch (step) {
      case 1:
        return <CategoryAndTypeStep />;
      case 2:
        return <DetailedFormStep />;
      default:
        return null;
    }
  }
}