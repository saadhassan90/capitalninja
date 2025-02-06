import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Send, BarChart, List, Settings, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Campaign } from "@/types/campaign";

export default function CampaignView() {
  const { id } = useParams();
  const navigate = useNavigate();

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
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/campaigns')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="text-muted-foreground">
            Campaign details and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Status</div>
          <div className="mt-1 text-2xl font-semibold">{campaign.status}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">List</div>
          <div className="mt-1 text-2xl font-semibold">{campaign.lists?.name || 'No list selected'}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Raise</div>
          <div className="mt-1 text-2xl font-semibold">{campaign.raise?.name || 'No raise selected'}</div>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sequence">
            <Mail className="h-4 w-4 mr-2" />
            Sequence
          </TabsTrigger>
          <TabsTrigger value="leads">
            <List className="h-4 w-4 mr-2" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Analytics</h2>
            <p className="text-muted-foreground">Campaign performance metrics will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="sequence" className="mt-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Email Sequence</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="mt-1">{campaign.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Content</h3>
                <div className="mt-1 whitespace-pre-wrap">{campaign.content}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Leads</h2>
            <p className="text-muted-foreground">List of leads targeted in this campaign will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Settings</h2>
            <p className="text-muted-foreground">Campaign configuration options will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}