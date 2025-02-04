import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRaiseForm } from "../../RaiseFormContext";

export function TimingSection() {
  const { formData, updateFormData } = useRaiseForm();

  const handleDateChange = (field: 'raise_open_date' | 'close_date' | 'first_close') => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [field]: e.target.value ? new Date(e.target.value) : null });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Raise Open Date</Label>
          <Input
            type="text"
            placeholder="MM/DD/YYYY"
            value={formatDate(formData.raise_open_date)}
            onChange={handleDateChange('raise_open_date')}
          />
        </div>

        <div className="space-y-2">
          <Label>Close Date</Label>
          <Input
            type="text"
            placeholder="MM/DD/YYYY"
            value={formatDate(formData.close_date)}
            onChange={handleDateChange('close_date')}
          />
        </div>

        <div className="space-y-2">
          <Label>First Close</Label>
          <Input
            type="text"
            placeholder="MM/DD/YYYY"
            value={formatDate(formData.first_close)}
            onChange={handleDateChange('first_close')}
          />
        </div>
      </div>
    </div>
  );
}