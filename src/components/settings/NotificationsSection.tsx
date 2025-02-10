
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { NotificationToggle } from "./NotificationToggle";
import { Loader2 } from "lucide-react";

export function NotificationsSection() {
  const { preferences, loading, updatePreference } = useNotificationPreferences();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NotificationToggle
        title="Email Notifications"
        description="Receive notifications via email"
        checked={preferences.email_notifications}
        onCheckedChange={(checked) => updatePreference("email_notifications", checked)}
      />

      <NotificationToggle
        title="Investor Updates"
        description="Receive updates about investors you follow"
        checked={preferences.investor_updates}
        onCheckedChange={(checked) => updatePreference("investor_updates", checked)}
      />

      <NotificationToggle
        title="Security Alerts"
        description="Get notified about security-related events"
        checked={preferences.security_alerts}
        onCheckedChange={(checked) => updatePreference("security_alerts", checked)}
      />

      <NotificationToggle
        title="Marketing Updates"
        description="Receive marketing and promotional emails"
        checked={preferences.marketing_updates}
        onCheckedChange={(checked) => updatePreference("marketing_updates", checked)}
      />
    </div>
  );
}
