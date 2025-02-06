import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, PencilLine } from "lucide-react";
import type { Campaign } from "@/types/campaign";

export default function CampaignDetails() {
  const { id } = useParams();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          lists!list_id (
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
      return data as Campaign;
    },
  });

  if (isLoading) {
    return <div>Loading campaign details...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="text-muted-foreground">
            Campaign details and performance metrics
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Campaign
          </Button>
          <Button disabled={campaign.status !== 'draft'}>
            <Send className="mr-2 h-4 w-4" />
            Send Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Status</h3>
          <Badge className="mt-2">{campaign.status}</Badge>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">List</h3>
          <p className="mt-2 text-muted-foreground">{campaign.lists?.name || 'No list selected'}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Raise</h3>
          <p className="mt-2 text-muted-foreground">{campaign.raise?.name || 'No raise selected'}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Opens</h3>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Clicks</h3>
          <p className="mt-2 text-2xl font-bold">0</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Recipients</h3>
          <p className="mt-2 text-2xl font-bold">{campaign.total_recipients || 0}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Content</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium">Subject</h3>
            <p className="text-muted-foreground mb-4">{campaign.subject}</p>
            
            <h3 className="text-lg font-medium">Content</h3>
            <div className="text-muted-foreground whitespace-pre-wrap">
              {campaign.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}