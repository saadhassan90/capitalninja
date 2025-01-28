import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignForm } from "@/components/campaigns/CampaignForm";

export default function NewCampaign() {
  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground">
            Set up and configure your email campaign
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="sequence">Sequence</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <CampaignForm />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sequence">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <p className="text-muted-foreground">Configure your email sequence (Coming soon)</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <p className="text-muted-foreground">View campaign analytics (Coming soon)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}