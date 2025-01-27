import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface MagicLinkFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  type: "signin" | "signup";
}

export function MagicLinkForm({ 
  email, 
  loading, 
  onEmailChange, 
  onSubmit,
  type 
}: MagicLinkFormProps) {
  const id = `${type}-email`;
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={id}>Email</Label>
        <Input
          id={id}
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        <Mail className="mr-2" />
        {loading ? "Sending magic link..." : "Send magic link"}
      </Button>
    </form>
  );
}