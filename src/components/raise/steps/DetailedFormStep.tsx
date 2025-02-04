import { useRaiseForm } from "../RaiseFormContext";
import { BasicInfoSection } from "./detailed-form/BasicInfoSection";

export function DetailedFormStep() {
  const { formData } = useRaiseForm();

  return (
    <div className="space-y-8">
      <BasicInfoSection />
    </div>
  );
}