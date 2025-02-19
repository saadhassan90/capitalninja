
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
        .select(`
          *,
          lists:list_id (
            name
          ),
          raise:raise_id (
            name,
            id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Ensure correct typing of lists property
      const typedData: Campaign = {
        ...data,
        lists: data.lists as { name: string } | null,
        raise: data.raise as { name: string, id: string } | null
      };

      return typedData;
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
