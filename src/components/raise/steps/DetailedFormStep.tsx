import { useRaiseForm } from "../RaiseFormContext";
import { BasicInfoSection } from "./detailed-form/BasicInfoSection";
import { InvestmentDetailsSection } from "./detailed-form/InvestmentDetailsSection";
import { TimingSection } from "./detailed-form/TimingSection";
import { FinancialDetailsSection } from "./detailed-form/FinancialDetailsSection";
import { ContactSection } from "./detailed-form/ContactSection";
import { StartupEquityForm } from "./detailed-form/StartupEquityForm";

export function DetailedFormStep() {
  const { formData } = useRaiseForm();

  if (formData.category === "startup" && formData.type === "equity") {
    return <StartupEquityForm />;
  }

  // For fund/direct deal equity, show the original form
  if (formData.category === "fund_direct_deal" && formData.type === "equity") {
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

  // For debt (both categories), show a coming soon message
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-lg text-gray-500">Debt raise form coming soon...</p>
    </div>
  );
}