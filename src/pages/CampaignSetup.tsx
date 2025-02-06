import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampaignSetup() {
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
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading campaign...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
        <p className="text-muted-foreground">
          Configure your campaign settings and content
        </p>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Campaign Settings</h2>
            {/* Campaign settings form will go here */}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Email Content</h2>
            {/* Email editor will go here */}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Preview</h2>
            {/* Preview content will go here */}
          </div>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">Recipients</h2>
            {/* Recipients list will go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}