import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useRaiseForm } from "../../RaiseFormContext";

export function TimingSection() {
  const { formData, updateFormData } = useRaiseForm();

  const handleDateChange = (field: 'raise_open_date' | 'close_date' | 'first_close') => (date: Date | undefined) => {
    updateFormData({ [field]: date || null });
  };

  const getDateValue = (dateString: Date | null) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Raise Open Date</Label>
          <DatePicker
            date={getDateValue(formData.raise_open_date)}
            onSelect={handleDateChange('raise_open_date')}
          />
        </div>

        <div className="space-y-2">
          <Label>Close Date</Label>
          <DatePicker
            date={getDateValue(formData.close_date)}
            onSelect={handleDateChange('close_date')}
          />
        </div>

        <div className="space-y-2">
          <Label>First Close</Label>
          <DatePicker
            date={getDateValue(formData.first_close)}
            onSelect={handleDateChange('first_close')}
          />
        </div>
      </div>
    </div>
  );
}