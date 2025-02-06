import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TestEmailRecipientsProps {
  testEmails: string[];
  newEmail: string;
  onNewEmailChange: (email: string) => void;
  onAddEmail: (email: string) => void;
  onRemoveEmail: (email: string) => void;
}

export function TestEmailRecipients({
  testEmails,
  newEmail,
  onNewEmailChange,
  onAddEmail,
  onRemoveEmail,
}: TestEmailRecipientsProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddEmail(newEmail);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground w-24">Send to:</span>
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-2">
          {testEmails.map((email) => (
            <div key={email} className="bg-muted text-sm px-2 py-1 rounded-md flex items-center gap-1">
              {email}
              <X 
                className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground" 
                onClick={() => onRemoveEmail(email)}
              />
            </div>
          ))}
        </div>
        {testEmails.length < 5 && (
          <Input 
            placeholder="Enter email address and press Enter" 
            value={newEmail}
            onChange={(e) => onNewEmailChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-sm h-8"
          />
        )}
      </div>
    </div>
  );
}