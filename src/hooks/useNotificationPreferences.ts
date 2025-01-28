import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export interface NotificationPreferences {
  email_notifications: boolean;
  list_updates: boolean;
  investor_updates: boolean;
  security_alerts: boolean;
  marketing_updates: boolean;
}

export const defaultPreferences: NotificationPreferences = {
  email_notifications: true,
  list_updates: true,
  investor_updates: true,
  security_alerts: true,
  marketing_updates: false,
};

export function useNotificationPreferences() {
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
        const { error: insertError } = await supabase
          .from("notification_preferences")
          .insert([{ user_id: user?.id, ...defaultPreferences }]);

        if (insertError) throw insertError;
        setPreferences(defaultPreferences);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch notification preferences",
        variant: "destructive",
      });
    } finally {
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

      setPreferences(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  return {
    preferences,
    loading,
    updatePreference,
  };
}