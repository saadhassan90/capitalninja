import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Emails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch user's Instantly credentials from user_subscriptions
  const { data: subscription } = useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("instantly_email, instantly_api_key")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Construct the Instantly.ai URL with proper authentication parameters
  const instantlyUrl = subscription?.instantly_email && subscription?.instantly_api_key
    ? `https://app.instantly.ai/auth/login?email=${encodeURIComponent(subscription.instantly_email)}&apiKey=${encodeURIComponent(subscription.instantly_api_key)}`
    : "https://app.instantly.ai";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Manage your email campaigns with Instantly.ai
        </p>
      </div>

      <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <iframe
          src={instantlyUrl}
          className="w-full h-full border-0"
          title="Instantly.ai"
          allow="clipboard-write"
          onLoad={handleIframeLoad}
        />
      </Card>
    </div>
  );
}