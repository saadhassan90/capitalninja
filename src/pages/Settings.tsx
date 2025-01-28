import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { 
  Settings as SettingsIcon, 
  Bell as BellIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
} from "lucide-react";
import Team from "./Team";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </h2>
            <div className="space-y-6">
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

      <Card className="p-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Team Management
          </h2>
          <Team />
        </div>
      </Card>

      <Card className="p-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Security
          </h2>
          <SecuritySection />
        </div>
      </Card>

      <Card className="p-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Notifications
          </h2>
          <NotificationsSection />
        </div>
      </Card>
    </div>
  );
}