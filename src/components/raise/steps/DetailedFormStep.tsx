import { useRaiseForm } from "../RaiseFormContext";
import { BasicInfoSection } from "./detailed-form/BasicInfoSection";
import { FinancialDetailsSection } from "./detailed-form/FinancialDetailsSection";
import { InvestmentDetailsSection } from "./detailed-form/InvestmentDetailsSection";
import { ContactSection } from "./detailed-form/ContactSection";

export function DetailedFormStep() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="space-y-8">
      <BasicInfoSection
        formData={{
          raise_name: formData.raise_name,
          target_raise: formData.target_raise,
        }}
        onChange={(data) => updateFormData(data)}
      />
      
      <ContactSection
        formData={{
          primary_contact: formData.primary_contact,
          contact_email: formData.contact_email,
          raise_description: formData.raise_description,
        }}
        onChange={(data) => updateFormData(data)}
      />

      <FinancialDetailsSection
        formData={{
          minimum_ticket_size: formData.minimum_ticket_size,
          capital_stack: formData.capital_stack,
          gp_capital: formData.gp_capital,
          carried_interest: formData.carried_interest,
          asset_management_fee: formData.asset_management_fee,
        }}
        onChange={(data) => updateFormData(data)}
      />

      <InvestmentDetailsSection
        formData={{
          assetClass: formData.assetClass,
          investment_type: formData.investment_type,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        }}
        onChange={(data) => updateFormData(data)}
      />
    </div>
  );
}