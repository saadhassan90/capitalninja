import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Plus } from "lucide-react";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { CampaignForm } from "@/components/campaigns/CampaignForm";

const Outreach = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <CampaignForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Outreach</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage email campaigns
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <CampaignList />
        </div>
      </div>
    </div>
  );
};

export default Outreach;