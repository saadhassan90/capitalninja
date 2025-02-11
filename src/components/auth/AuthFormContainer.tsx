
import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthHeader } from "./AuthHeader";
import { MagicLinkForm, SignupFormData } from "./MagicLinkForm";
import { TestLoginButton } from "./TestLoginButton";

interface AuthFormContainerProps {
  email: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSignIn: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent, formData: SignupFormData) => void;
  onTestLogin: () => void;
  isInvitation?: boolean;
  invitedEmail?: string;
}

export const AuthFormContainer: FC<AuthFormContainerProps> = ({
  email,
  loading,
  onEmailChange,
  onSignIn,
  onSignUp,
  onTestLogin,
  isInvitation,
  invitedEmail,
}) => {
  // Determine which tab should be active by default
  const defaultTab = invitedEmail === email ? "signin" : "signup";

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader />

        {isInvitation && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You've been invited to join Capital Ninja. Please {invitedEmail === email ? 'sign in' : 'sign up'} with your email address to accept the invitation.
            </p>
          </div>
        )}

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <MagicLinkForm
              type="signin"
              email={email}
              loading={loading}
              onEmailChange={onEmailChange}
              onSubmit={onSignIn}
              isInvitation={isInvitation}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <MagicLinkForm
              type="signup"
              email={email}
              loading={loading}
              onEmailChange={onEmailChange}
              onSubmit={onSignUp}
              isInvitation={isInvitation}
            />
          </TabsContent>
        </Tabs>

        <TestLoginButton loading={loading} onClick={onTestLogin} />
      </div>
    </div>
  );
};
