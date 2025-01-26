import { Input } from "@/components/ui/input";

interface InvestorsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function InvestorsSearch({ value, onChange }: InvestorsSearchProps) {
  return (
    <div className="mb-6">
      <Input
        placeholder="Search investors..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm focus:outline-none focus:ring-0 focus:border-gray-300"
      />
    </div>
  );
}