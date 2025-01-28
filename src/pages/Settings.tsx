import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Team from "./Team";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { Badge } from "@/components/ui/badge";
import { Clock, Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";

export default function Settings() {
  const { theme, setTheme } = useTheme();

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
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme Preference</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred color theme
                      </p>
                    </div>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout throughout the app
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the app by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Team />
        </TabsContent>

        <TabsContent value="security">
          <div className="rounded-lg border bg-card p-8">
            <SecuritySection />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-lg border bg-card p-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Notification Settings</h2>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs bg-muted">
                <Clock className="h-3 w-3" />
                Coming Soon
              </Badge>
            </div>
            <NotificationsSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}