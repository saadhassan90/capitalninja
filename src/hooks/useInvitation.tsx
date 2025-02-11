
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface InvitationData {
  email: string;
  role: string;
}

export const useInvitation = (invitationToken: string | null) => {
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const { toast } = useToast();

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

  return invitationData;
};
