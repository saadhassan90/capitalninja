import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CampaignHeader } from "@/components/campaigns/CampaignHeader";
import { CampaignDetails } from "@/components/campaigns/CampaignDetails";
import { CampaignInvestorsTable } from "@/components/campaigns/CampaignInvestorsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { Campaign } from "@/types/campaign";

export default function CampaignView() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);

  const { data: campaignData, isLoading, error } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCampaign(data);
      return data as Campaign;
    },
    onSuccess: (data) => {
      setCampaign(data);
    },
    enabled: !!id,
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && investorsData?.data) {
      const allIds = investorsData.data.map(investor => investor.id.toString());
      setSelectedInvestors(allIds);
    } else {
      setSelectedInvestors([]);
    }
  };

  const handleSelectInvestor = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInvestors(prev => [...prev, id]);
    } else {
      setSelectedInvestors(prev => prev.filter(investorId => investorId !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !campaignData) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load campaign. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CampaignHeader campaign={campaignData} />
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <CampaignDetails campaign={campaignData} />
        <div className="flex-1">
          <CampaignInvestorsTable
            campaign={campaignData}
            selectedInvestors={selectedInvestors}
            onSelectAll={handleSelectAll}
            onSelectInvestor={handleSelectInvestor}
          />
        </div>
      </div>
    </div>
  );
}
