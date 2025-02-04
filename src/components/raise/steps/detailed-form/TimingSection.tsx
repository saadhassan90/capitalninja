import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useRaiseForm } from "../../RaiseFormContext";

export function TimingSection() {
  const { formData, updateFormData } = useRaiseForm();

  const handleDateChange = (field: 'raise_open_date' | 'close_date' | 'first_close', date: Date | undefined) => {
    updateFormData({ [field]: date || null });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Raise Open Date</Label>
          <DatePicker
            date={formData.raise_open_date ? new Date(formData.raise_open_date) : undefined}
            onSelect={(date) => handleDateChange('raise_open_date', date)}
          />
        </div>

        <div className="space-y-2">
          <Label>Close Date</Label>
          <DatePicker
            date={formData.close_date ? new Date(formData.close_date) : undefined}
            onSelect={(date) => handleDateChange('close_date', date)}
          />
        </div>

        <div className="space-y-2">
          <Label>First Close</Label>
          <DatePicker
            date={formData.first_close ? new Date(formData.first_close) : undefined}
            onSelect={(date) => handleDateChange('first_close', date)}
          />
        </div>
      </div>
    </div>
  );
}