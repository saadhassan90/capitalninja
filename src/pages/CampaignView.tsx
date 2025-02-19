
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { Campaign } from "@/types/campaign";

export default function CampaignView() {
  const { id } = useParams();
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);

  const { data: campaignData, isLoading, error } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");

      // First get the campaign details
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (campaignError) throw campaignError;

      // If there's a list_id, fetch the list details
      let listData = null;
      if (campaign.list_id) {
        const { data: list, error: listError } = await supabase
          .from('lists')
          .select('name')
          .eq('id', campaign.list_id)
          .single();
        
        if (!listError && list) {
          listData = { name: list.name };
        }
      }

      // If there's a raise_id, fetch the raise details
      let raiseData = null;
      if (campaign.raise_id) {
        const { data: raise, error: raiseError } = await supabase
          .from('raises')
          .select('name, id')
          .eq('id', campaign.raise_id)
          .single();
        
        if (!raiseError && raise) {
          raiseData = raise;
        }
      }

      // Transform the data to match the Campaign type
      const transformedData: Campaign = {
        ...campaign,
        lists: listData,
        raise: raiseData
      };

      return transformedData;
    },
    enabled: !!id,
  });

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{campaignData.name}</h1>
      <pre className="whitespace-pre-wrap">{JSON.stringify(campaignData, null, 2)}</pre>
    </div>
  );
}
