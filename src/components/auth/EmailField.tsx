import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  id: string;
  email: string;
  onEmailChange: (email: string) => void;
}

export function EmailField({ id, email, onEmailChange }: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Email</Label>
      <Input
        id={id}
        type="email"
        placeholder="m@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        className="h-12"
      />
    </div>
  );
}