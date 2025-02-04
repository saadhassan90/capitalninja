import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useRaiseForm } from "../../RaiseFormContext";

export function TimingSection() {
  const { formData, updateFormData } = useRaiseForm();

  const handleDateChange = (field: 'raise_open_date' | 'close_date' | 'first_close') => (date: Date | undefined) => {
    updateFormData({ [field]: date });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Raise Open Date</Label>
          <DatePicker
            date={formData.raise_open_date instanceof Date ? formData.raise_open_date : undefined}
            onSelect={handleDateChange('raise_open_date')}
          />
        </div>

        <div className="space-y-2">
          <Label>Close Date</Label>
          <DatePicker
            date={formData.close_date instanceof Date ? formData.close_date : undefined}
            onSelect={handleDateChange('close_date')}
          />
        </div>

        <div className="space-y-2">
          <Label>First Close</Label>
          <DatePicker
            date={formData.first_close instanceof Date ? formData.first_close : undefined}
            onSelect={handleDateChange('first_close')}
          />
        </div>
      </div>
    </div>
  );
}