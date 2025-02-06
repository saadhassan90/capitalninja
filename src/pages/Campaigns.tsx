import { useState } from "react";
import { CampaignsTable } from "@/components/campaigns/CampaignsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import type { Campaign } from "@/types/campaign";

export default function Campaigns() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

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
      
      <CampaignsTable onEdit={setEditingCampaign} />

      <CampaignForm 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}