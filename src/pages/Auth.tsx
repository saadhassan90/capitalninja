
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { AuthLeftColumn } from "@/components/auth/AuthLeftColumn";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { useInvitation } from "@/hooks/useInvitation";
import { useAuthActions } from "@/hooks/useAuthActions";
import type { SignupFormData } from "@/components/auth/MagicLinkForm";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('invitation');
  const invitationData = useInvitation(invitationToken);
  const { loading, handleSignUp, handleSignIn, handleTestLogin } = useAuthActions();

  // Set email when invitation data is loaded
  useEffect(() => {
    if (invitationData?.email) {
      console.log('Setting email from invitation:', invitationData.email);
      setEmail(invitationData.email);
    }
  }, [invitationData]);

  const onSignUp = async (e: React.FormEvent, formData: SignupFormData) => {
    e.preventDefault();
    await handleSignUp(email, formData, invitationToken);
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, invitationToken);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AuthLeftColumn />
      <div className="flex-1 flex flex-col">
        <AuthPageHeader />
        <AuthFormContainer
          email={email}
          loading={loading}
          onEmailChange={setEmail}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          onTestLogin={handleTestLogin}
          isInvitation={!!invitationData}
          invitedEmail={invitationData?.email}
        />
      </div>
    </div>
  );
}
