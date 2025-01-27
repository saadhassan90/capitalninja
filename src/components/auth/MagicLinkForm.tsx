import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Link } from "react-router-dom";

interface MagicLinkFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent, formData?: SignupFormData) => void;
  type: "signin" | "signup";
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  acceptedTerms: boolean;
}

export function MagicLinkForm({ 
  email, 
  loading, 
  onEmailChange, 
  onSubmit,
  type 
}: MagicLinkFormProps) {
  const id = `${type}-email`;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "signup") {
      onSubmit(e, {
        firstName,
        lastName,
        company,
        title,
        acceptedTerms,
      });
    } else {
      onSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {type === "signup" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Acme Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Software Engineer"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              required
            />
            <Label htmlFor="terms" className="text-sm">
              I accept the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                terms and conditions
              </Link>
            </Label>
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || (type === "signup" && !acceptedTerms)}
      >
        <Mail className="mr-2" />
        {loading ? "Sending magic link..." : "Send magic link"}
      </Button>
    </form>
  );
}