import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useRaiseForm } from "../../RaiseFormContext";

export function TimingSection() {
  const { formData, updateFormData } = useRaiseForm();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Raise Open Date</Label>
        <DatePicker
          date={formData.raise_open_date ? new Date(formData.raise_open_date) : undefined}
          onSelect={(date) => updateFormData({ raise_open_date: date })}
        />
      </div>

      <div className="space-y-2">
        <Label>Close Date</Label>
        <DatePicker
          date={formData.close_date ? new Date(formData.close_date) : undefined}
          onSelect={(date) => updateFormData({ close_date: date })}
        />
      </div>
    </div>
  );
}