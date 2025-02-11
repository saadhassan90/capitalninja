
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { SignupFormData } from "@/components/auth/MagicLinkForm";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (
    email: string,
    formData: SignupFormData,
    invitationToken: string | null
  ) => {
    setLoading(true);

    try {
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

  const handleSignIn = async (email: string, invitationToken: string | null) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
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

  return {
    loading,
    handleSignUp,
    handleSignIn,
    handleTestLogin,
  };
};
