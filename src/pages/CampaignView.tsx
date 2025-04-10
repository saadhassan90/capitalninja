
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { Campaign } from "@/types/campaign";

export default function CampaignView() {
  const { id } = useParams();

  const { data: campaignData, isLoading, error } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");

      console.log('Fetching campaign:', id);

      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          id,
          name,
          subject,
          content,
          status,
          scheduled_for,
          created_by,
          created_at,
          updated_at,
          sent_at,
          total_recipients,
          successful_sends,
          failed_sends,
          raise:raise_id (
            name,
            id
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
        throw error;
      }

      console.log('Fetched campaign data:', data);

      return {
        ...data,
        raise: data?.raise || null
      } as Campaign;
    },
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Campaign ID is required</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !campaignData) {
    console.error('Error in component:', error);
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
