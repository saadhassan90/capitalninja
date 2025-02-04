import { useRaiseForm } from "../RaiseFormContext";
import { BasicInfoSection } from "./detailed-form/BasicInfoSection";
import { InvestmentDetailsSection } from "./detailed-form/InvestmentDetailsSection";
import { TimingSection } from "./detailed-form/TimingSection";
import { FinancialDetailsSection } from "./detailed-form/FinancialDetailsSection";
import { ContactSection } from "./detailed-form/ContactSection";

export function DetailedFormStep() {
  const { formData } = useRaiseForm();

  return (
    <div className="space-y-8">
      <BasicInfoSection />
      <InvestmentDetailsSection />
      <TimingSection />
      <FinancialDetailsSection />
      <ContactSection />
    </div>
  );
}