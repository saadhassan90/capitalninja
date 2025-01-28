import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Team from "./Team";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <p className="text-muted-foreground">
              Configure your general account settings
            </p>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Team />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="rounded-lg border bg-card p-8">
            <SecuritySection />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-lg border bg-card p-8">
            <NotificationsSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}