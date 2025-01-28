import { Mail } from "lucide-react";
import { CampaignForm } from "@/components/campaigns/CampaignForm";

export default function NewCampaign() {
  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Mail className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
        </div>
        <p className="text-muted-foreground">
          Create a new email campaign to reach out to investors
        </p>
      </div>

      <div className="grid gap-6">
        <CampaignForm />
      </div>
    </div>
  );
}