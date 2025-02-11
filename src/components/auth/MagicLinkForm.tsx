
import { useState } from "react";
import { EmailField } from "./EmailField";
import { SignupFormFields } from "./SignupFormFields";
import { SubmitButton } from "./SubmitButton";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  acceptedTerms: boolean;
}

interface MagicLinkFormProps {
  type: "signin" | "signup";
  email: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent, formData?: SignupFormData) => void;
  isInvitation?: boolean;
}

export function MagicLinkForm({
  type,
  email,
  loading,
  onEmailChange,
  onSubmit,
  isInvitation
}: MagicLinkFormProps) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailField
        id={`${type}-email`}
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
          isInvitation={isInvitation}
        />
      )}

      <SubmitButton loading={loading} isFormValid={type === "signin" ? email.trim() !== "" : (
        email.trim() !== "" &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        (!isInvitation ? company.trim() !== "" : true) &&
        title.trim() !== "" &&
        acceptedTerms
      )} />
    </form>
  );
}
