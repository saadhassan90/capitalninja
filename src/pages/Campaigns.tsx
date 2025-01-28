import { CampaignList } from "@/components/campaigns/CampaignList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Plus } from "lucide-react";

export default function Campaigns() {
  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          </div>
          <p className="text-muted-foreground">
            Create and manage your email campaigns
          </p>
        </div>
        <Button asChild>
          <Link to="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>
      <CampaignList />
    </div>
  );
}