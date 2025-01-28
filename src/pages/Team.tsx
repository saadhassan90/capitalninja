import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { InviteUserDialog } from "@/components/team/InviteUserDialog";
import { TeamMembersTable } from "@/components/team/TeamMembersTable";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";

export default function Team() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles (
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .returns<TeamMember[]>();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Team Management</h2>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <TeamMembersTable members={teamMembers || []} isLoading={isLoading} />
      
      <InviteUserDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}