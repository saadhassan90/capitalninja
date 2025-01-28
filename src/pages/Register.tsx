import { useState } from "react";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { SignupFormData } from "@/components/auth/MagicLinkForm";

export default function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add sign in logic here
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent, formData: SignupFormData) => {
    e.preventDefault();
    setLoading(true);
    // Add sign up logic here
    setLoading(false);
  };

  const handleTestLogin = async () => {
    setLoading(true);
    // Add test login logic here
    setLoading(false);
  };

  return (
    <AuthFormContainer
      email={email}
      loading={loading}
      onEmailChange={setEmail}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onTestLogin={handleTestLogin}
    />
  );
}