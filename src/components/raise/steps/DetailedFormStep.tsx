import { useRaiseForm } from "../RaiseFormContext";
import { BasicInfoSection } from "./detailed-form/BasicInfoSection";
import { FinancialDetailsSection } from "./detailed-form/FinancialDetailsSection";
import { InvestmentDetailsSection } from "./detailed-form/InvestmentDetailsSection";

export function DetailedFormStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-8">
      <BasicInfoSection
        formData={{
          raise_name: formData.raise_name,
          raise_description: formData.raise_description,
          target_raise: formData.target_raise,
          primary_contact: formData.primary_contact,
          contact_email: formData.contact_email,
        }}
        onChange={(data) => updateFormData(data)}
      />
      <FinancialDetailsSection />
      <InvestmentDetailsSection />
    </div>
  );
}