import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Team from "./Team";

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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
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

        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
            <p className="text-muted-foreground">
              Manage your notification settings
            </p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <p className="text-muted-foreground">
              Configure your security preferences
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}