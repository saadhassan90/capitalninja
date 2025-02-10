
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Settings } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function Emails() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("campaigns");

  // Check if user is admin to show settings
  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user?.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user
  });

  // Fetch Instantly settings if user is admin
  const { data: instantlySettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['instantly-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instantly_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
        <p className="text-muted-foreground">
          Create and manage your email campaigns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Campaigns</h2>
              <Button>Create Campaign</Button>
            </div>
            
            {/* Placeholder for campaigns list */}
            <div className="text-muted-foreground text-center py-8">
              No campaigns yet. Create your first campaign to get started.
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Email Templates</h2>
              <Button>Create Template</Button>
            </div>
            
            {/* Placeholder for templates list */}
            <div className="text-muted-foreground text-center py-8">
              No templates yet. Create your first template to get started.
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Campaign Analytics</h2>
            
            {/* Placeholder for analytics */}
            <div className="text-muted-foreground text-center py-8">
              No campaign data available yet.
            </div>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Instantly.ai Settings</h2>
              </div>
              
              {loadingSettings ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : instantlySettings ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Agency Email</label>
                    <div className="mt-1 text-muted-foreground">
                      {instantlySettings.agency_email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Key Status</label>
                    <div className="mt-1 text-muted-foreground">
                      ✓ Connected
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  No Instantly.ai settings configured. Please add your agency credentials.
                </div>
              )}
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
