
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { AuthLeftColumn } from "@/components/auth/AuthLeftColumn";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import type { SignupFormData } from "@/components/auth/MagicLinkForm";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [invitationData, setInvitationData] = useState<{ email: string; role: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('invitation');

  useEffect(() => {
    const checkInvitation = async () => {
      if (!invitationToken) return;

      try {
        const { data, error } = await supabase
          .from('team_invitations')
          .select('email, role, status, expires_at')
          .eq('token', invitationToken)
          .eq('status', 'pending')
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            variant: "destructive",
            title: "Invalid invitation",
            description: "This invitation link is invalid or has expired.",
          });
          return;
        }

        const expiryDate = new Date(data.expires_at);
        if (expiryDate < new Date()) {
          toast({
            variant: "destructive",
            title: "Expired invitation",
            description: "This invitation has expired.",
          });
          return;
        }

        setEmail(data.email);
        setInvitationData({ email: data.email, role: data.role });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify invitation. Please try again.",
        });
      }
    };

    checkInvitation();
  }, [invitationToken, toast]);

  const handleSignUp = async (e: React.FormEvent, formData: SignupFormData) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, sign up the user with Supabase Auth
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });
      
      if (signUpError) throw signUpError;

      // Then, update their profile with additional information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: formData.company,
          title: formData.title,
          email: email,
        })
        .eq("email", email);
      
      if (profileError) throw profileError;

      // If this is from an invitation, update the invitation status
      if (invitationToken) {
        const { error: invitationError } = await supabase
          .from('team_invitations')
          .update({ status: 'accepted' })
          .eq('token', invitationToken);

        if (invitationError) throw invitationError;
      }
      
      toast({
        title: "Success",
        description: "Check your email for the magic link to complete your signup.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      // If this is from an invitation, update the invitation status
      if (invitationToken) {
        const { error: invitationError } = await supabase
          .from('team_invitations')
          .update({ status: 'accepted' })
          .eq('token', invitationToken);

        if (invitationError) throw invitationError;
      }

      toast({
        title: "Success",
        description: "Check your email for the magic link to sign in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "saadhassan90@gmail.com",
        password: "test123456",
      });

      if (error) throw error;
      
      toast({
        title: "Test login successful",
        description: "You are now logged in with the test account.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
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
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onTestLogin={handleTestLogin}
          isInvitation={!!invitationData}
          invitedEmail={invitationData?.email}
        />
      </div>
    </div>
  );
}
