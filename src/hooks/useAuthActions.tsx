
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
      // First get the invitation data if there's a token
      let invitingTeamMember = null;
      if (invitationToken) {
        const { data: invitation, error: invitationError } = await supabase
          .from("team_invitations")
          .select(`
            email,
            team_member:team_members!team_invitations_team_member_id_fkey(
              id,
              user_id,
              profiles!team_members_user_id_fkey(
                company_name
              )
            )
          `)
          .eq("token", invitationToken)
          .maybeSingle();

        if (invitationError) throw invitationError;
        invitingTeamMember = invitation?.team_member;
      }

      // Sign up the user with metadata
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

      // The profile, notification preferences, and team member records will be created automatically
      // by our database trigger. We just need to update the additional profile fields.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError) throw profileError;

      // Update the profile with the additional form data
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          company_name: invitingTeamMember ? invitingTeamMember.profiles.company_name : formData.company,
          title: formData.title,
          invited_by_team_id: invitingTeamMember?.id || null
        })
        .eq("id", profile.id);
      
      if (updateError) throw updateError;

      // Update invitation status if signing up through invitation
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
      console.error('Signup error:', error);
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
