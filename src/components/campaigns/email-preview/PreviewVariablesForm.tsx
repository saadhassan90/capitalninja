import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PreviewVariablesFormProps {
  senderEmail: string;
  senderName: string;
  recipientFirstName: string;
  onVariableChange: (field: string, value: string) => void;
}

export function PreviewVariablesForm({
  senderEmail,
  senderName,
  recipientFirstName,
  onVariableChange,
}: PreviewVariablesFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Sender Email</Label>
        <Input 
          value={senderEmail}
          onChange={(e) => onVariableChange('senderEmail', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Sender Full Name</Label>
        <Input 
          value={senderName}
          onChange={(e) => onVariableChange('senderName', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Recipient First Name</Label>
        <Input 
          value={recipientFirstName}
          onChange={(e) => onVariableChange('recipientFirstName', e.target.value)}
        />
      </div>
    </div>
  );
}