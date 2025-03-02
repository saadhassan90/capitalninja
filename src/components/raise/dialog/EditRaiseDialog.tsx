import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RaiseFormProvider } from "../RaiseFormContext";
import { RaiseDialogHeader } from "./RaiseDialogHeader";
import { RaiseDialogFooter } from "./RaiseDialogFooter";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoSection } from "../steps/detailed-form/BasicInfoSection";
import { FinancialDetailsSection } from "../steps/detailed-form/FinancialDetailsSection";
import { InvestmentDetailsSection } from "../steps/detailed-form/InvestmentDetailsSection";
import { ContactSection } from "../steps/detailed-form/ContactSection";
import type { RaiseProject } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AssetClassType } from "../types/raiseTypes";

interface EditRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RaiseProject;
  onUpdate?: () => void;
}

interface FormDataState {
  raise_name: string;
  raise_description: string;
  target_raise: string;
  primary_contact: string;
  contact_email: string;
  minimum_ticket_size: string;
  capital_stack: string[];
  gp_capital: string;
  carried_interest: string;
  asset_management_fee: string;
  assetClass: AssetClassType;
  investment_type: string;
  city: string;
  state: string;
  country: string;
}

export function EditRaiseDialog({ open, onOpenChange, project, onUpdate }: EditRaiseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormDataState>({
    raise_name: project.name,
    raise_description: project.description || '',
    target_raise: project.target_amount?.toString() || '',
    primary_contact: '',
    contact_email: '',
    minimum_ticket_size: '',
    capital_stack: [],
    gp_capital: '',
    carried_interest: '',
    asset_management_fee: '',
    assetClass: 'Other' as AssetClassType,
    investment_type: '',
    city: '',
    state: '',
    country: ''
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
          minimum_ticket_size: parseFloat(formData.minimum_ticket_size),
          capital_stack: formData.capital_stack,
          gp_capital: parseFloat(formData.gp_capital),
          carried_interest: parseFloat(formData.carried_interest),
          asset_management_fee: parseFloat(formData.asset_management_fee),
          asset_classes: [formData.assetClass],
          investment_type: formData.investment_type,
          city: formData.city,
          state: formData.state,
          country: formData.country,
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
          <RaiseDialogHeader step={1} totalSteps={1} isEdit={true} />
          
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              <BasicInfoSection
                formData={formData}
                onChange={(data: Partial<FormDataState>) => setFormData(prev => ({ ...prev, ...data }))}
              />
              
              <ContactSection
                formData={formData}
                onChange={(data: Partial<FormDataState>) => setFormData(prev => ({ ...prev, ...data }))}
              />

              <FinancialDetailsSection
                formData={formData}
                onChange={(data: Partial<FormDataState>) => setFormData(prev => ({ ...prev, ...data }))}
              />

              <InvestmentDetailsSection
                formData={formData}
                onChange={(data: Partial<FormDataState>) => setFormData(prev => ({ ...prev, ...data }))}
              />
            </div>
          </ScrollArea>

          <RaiseDialogFooter
            step={1}
            totalSteps={1}
            isStepValid={true}
            isSubmitting={isSubmitting}
            onBack={() => {}}
            onNext={() => {}}
            onSubmit={handleSubmit}
            submitText="Save Changes"
          />
        </RaiseFormProvider>
      </DialogContent>
    </Dialog>
  );
}