import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface SignupFormFieldsProps {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  acceptedTerms: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onAcceptedTermsChange: (checked: boolean) => void;
}

export function SignupFormFields({
  firstName,
  lastName,
  company,
  title,
  acceptedTerms,
  onFirstNameChange,
  onLastNameChange,
  onCompanyChange,
  onTitleChange,
  onAcceptedTermsChange,
}: SignupFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
            placeholder="John"
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
            placeholder="Doe"
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          required
          placeholder="Acme Inc."
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          placeholder="Software Engineer"
          className="h-12"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptedTerms}
          onCheckedChange={(checked) => onAcceptedTermsChange(checked as boolean)}
          required
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I accept the{" "}
          <Link to="/terms" className="text-primary hover:underline">
            terms and conditions
          </Link>
        </Label>
      </div>
    </>
  );
}