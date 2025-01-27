import { useState, useEffect } from "react";
import { EmailField } from "./EmailField";
import { SignupFormFields } from "./SignupFormFields";
import { SubmitButton } from "./SubmitButton";

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
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (type === "signup") {
      setIsFormValid(
        email.trim() !== "" &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        company.trim() !== "" &&
        title.trim() !== "" &&
        acceptedTerms
      );
    } else {
      setIsFormValid(email.trim() !== "");
    }
  }, [email, firstName, lastName, company, title, acceptedTerms, type]);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailField
        id={id}
        email={email}
        onEmailChange={onEmailChange}
      />

      {type === "signup" && (
        <SignupFormFields
          firstName={firstName}
          lastName={lastName}
          company={company}
          title={title}
          acceptedTerms={acceptedTerms}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onCompanyChange={setCompany}
          onTitleChange={setTitle}
          onAcceptedTermsChange={setAcceptedTerms}
        />
      )}

      <SubmitButton loading={loading} isFormValid={isFormValid} />
    </form>
  );
}