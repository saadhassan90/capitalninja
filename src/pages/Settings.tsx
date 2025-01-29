import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { TeamMembersTable } from "@/components/team/TeamMembersTable";
import { InviteUserDialog } from "@/components/team/InviteUserDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TeamMember } from "@/types/team";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            email,
            first_name,
            last_name,
            avatar_url
          )
        `);

      if (error) throw error;
      return data as TeamMember[];
    }
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences, team, security, and notification settings
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="general" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            General
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <SecuritySection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="team" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Team Management
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              <Button onClick={() => setInviteDialogOpen(true)}>
                Invite User
              </Button>
              <TeamMembersTable 
                members={members || []}
                isLoading={isLoading}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Privacy
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="text-muted-foreground">
              Privacy settings coming soon...
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notifications" className="border rounded-lg p-4">
          <AccordionTrigger className="text-xl font-semibold">
            Notifications
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <NotificationsSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <InviteUserDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}