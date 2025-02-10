
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ShoppingCart } from "lucide-react";

export default function Emails() {
  const [activeTab, setActiveTab] = useState("domains");

  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: ['email-domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_domains')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['email-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_accounts')
        .select(`
          *,
          email_domains (
            domain_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Management</h1>
          <p className="text-muted-foreground">
            Manage your email domains and accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Domain
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Domain
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          {domainsLoading ? (
            <div>Loading domains...</div>
          ) : domains?.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Domains Added</CardTitle>
                <CardDescription>
                  Get started by adding your first domain
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Domain
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Domain
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {domains?.map((domain) => (
                <Card key={domain.id}>
                  <CardHeader>
                    <CardTitle>{domain.domain_name}</CardTitle>
                    <CardDescription>Status: {domain.status}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Domain details will go here */}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Verify</Button>
                    <Button variant="destructive">Remove</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          {accountsLoading ? (
            <div>Loading accounts...</div>
          ) : accounts?.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Email Accounts</CardTitle>
                <CardDescription>
                  Add a domain first, then create email accounts
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts?.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <CardTitle>{account.email}</CardTitle>
                    <CardDescription>
                      Domain: {account.email_domains.domain_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>Status: {account.status}</div>
                      <div>Daily Limit: {account.daily_limit}</div>
                      <div>
                        Warmup: {account.warmup_enabled ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Edit</Button>
                    <Button variant="destructive">Delete</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Instantly.ai Integration</CardTitle>
              <CardDescription>
                Connect your Instantly.ai account to manage your email infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Instantly.ai integration settings will go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

