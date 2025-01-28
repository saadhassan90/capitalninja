import { Settings as SettingsIcon } from "lucide-react";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { TeamMembersTable } from "@/components/team/TeamMembersTable";
import { Button } from "@/components/ui/button";
import { InviteUserDialog } from "@/components/team/InviteUserDialog";
import { useState } from "react";

export default function Settings() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-2 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <NotificationsSection />
      <SecuritySection />
      <TeamMembersTable />
      
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
