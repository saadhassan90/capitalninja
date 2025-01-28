import { Settings as SettingsIcon } from "lucide-react";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { TeamMembersTable } from "@/components/team/TeamMembersTable";
import { Button } from "@/components/ui/button";
import { InviteUserDialog } from "@/components/team/InviteUserDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TeamMember } from "@/types/team";

export default function Settings() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as TeamMember[]) || [];
    }
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-2 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <NotificationsSection />
      <SecuritySection />
      <TeamMembersTable 
        members={members || []}
        isLoading={isLoading}
      />
      
      <Button onClick={() => setInviteDialogOpen(true)}>
        Invite User
      </Button>
      
      <InviteUserDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}