import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface NotificationPreferences {
  email_notifications: boolean;
  list_updates: boolean;
  investor_updates: boolean;
  security_alerts: boolean;
  marketing_updates: boolean;
}

const defaultPreferences: NotificationPreferences = {
  email_notifications: true,
  list_updates: true,
  investor_updates: true,
  security_alerts: true,
  marketing_updates: false,
};

export function NotificationsSection() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences(data);
      } else {
        // If no preferences exist, create them with default values
        const { error: insertError } = await supabase
          .from("notification_preferences")
          .insert([{ user_id: user?.id, ...defaultPreferences }]);

        if (insertError) throw insertError;
        setPreferences(defaultPreferences);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notification preferences",
      });
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const { error } = await supabase
        .from("notification_preferences")
        .update({ [key]: value })
        .eq("user_id", user?.id);

      if (error) throw error;

      setPreferences((prev) => ({ ...prev, [key]: value }));
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences",
      });
    }
  };

  if (loading) {
    return <div className="space-y-4">Loading notification preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Choose what notifications you want to receive
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Email Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={preferences.email_notifications}
            onCheckedChange={(checked) => updatePreference("email_notifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">List Updates</label>
            <p className="text-sm text-muted-foreground">
              Get notified when your lists are updated
            </p>
          </div>
          <Switch
            checked={preferences.list_updates}
            onCheckedChange={(checked) => updatePreference("list_updates", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Investor Updates</label>
            <p className="text-sm text-muted-foreground">
              Receive updates about investors you follow
            </p>
          </div>
          <Switch
            checked={preferences.investor_updates}
            onCheckedChange={(checked) => updatePreference("investor_updates", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Security Alerts</label>
            <p className="text-sm text-muted-foreground">
              Get notified about security-related events
            </p>
          </div>
          <Switch
            checked={preferences.security_alerts}
            onCheckedChange={(checked) => updatePreference("security_alerts", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Marketing Updates</label>
            <p className="text-sm text-muted-foreground">
              Receive marketing and promotional emails
            </p>
          </div>
          <Switch
            checked={preferences.marketing_updates}
            onCheckedChange={(checked) => updatePreference("marketing_updates", checked)}
          />
        </div>
      </div>
    </div>
  );
}