import { useState } from "react";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampaignForm } from "@/components/campaigns/CampaignForm";

export default function Campaigns() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your email campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <CampaignList />

      <CampaignForm 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}