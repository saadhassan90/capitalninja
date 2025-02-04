import { useRaiseForm } from "../RaiseFormContext";
import { BasicInfoSection } from "./detailed-form/BasicInfoSection";

export function DetailedFormStep() {
  const { formData, updateFormData } = useRaiseForm();

  const basicInfoData = {
    name: formData.name,
    description: formData.raise_description,
    target_amount: formData.targetAmount,
  };

  const handleBasicInfoChange = (data: Partial<typeof basicInfoData>) => {
    updateFormData({
      name: data.name,
      raise_description: data.description,
      targetAmount: data.target_amount,
    });
  };

  return (
    <div className="space-y-8">
      <BasicInfoSection
        formData={basicInfoData}
        onChange={handleBasicInfoChange}
      />
    </div>
  );
}