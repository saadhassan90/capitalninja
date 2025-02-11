
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

        if (error) {
          console.error('Error fetching invitation:', error);
          throw error;
        }

        if (!data) {
          console.log('No invitation found or invalid token');
          toast({
            variant: "destructive",
            title: "Invalid invitation",
            description: "This invitation link is invalid or has expired.",
          });
          return;
        }

        const expiryDate = new Date(data.expires_at);
        if (expiryDate < new Date()) {
          console.log('Invitation expired');
          toast({
            variant: "destructive",
            title: "Expired invitation",
            description: "This invitation has expired.",
          });
          return;
        }

        console.log('Valid invitation found:', data);
        setInvitationData({ email: data.email, role: data.role });
      } catch (error: any) {
        console.error('Error in checkInvitation:', error);
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
