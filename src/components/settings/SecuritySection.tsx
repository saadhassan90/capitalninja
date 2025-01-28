import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface UserSession {
  id: string;
  device_info: string | null;
  ip_address: string | null;
  last_active: string;
  created_at: string;
  is_active: boolean;
}

export function SecuritySection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["user-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", user?.id)
        .order("last_active", { ascending: false });

      if (error) throw error;
      return data as UserSession[];
    },
    enabled: !!user?.id,
  });

  const terminateSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from("user_sessions")
        .update({ is_active: false })
        .eq("id", sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
      toast({
        title: "Session terminated",
        description: "The session has been terminated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to terminate session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: user?.email,
      });
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Check your email to verify your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <h4 className="font-medium">Email Address</h4>
          <p className="text-sm text-muted-foreground">
            {user?.email}
            {user?.email_confirmed_at ? (
              <span className="ml-2 text-green-600">(Verified)</span>
            ) : (
              <span className="ml-2 text-yellow-600">
                (Not verified - 
                <button 
                  onClick={handleUpdateEmail}
                  className="text-primary hover:underline ml-1"
                >
                  Resend verification email
                </button>
                )
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-2">
          <h4 className="font-medium">Two-Factor Authentication</h4>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
          <Button 
            variant="outline" 
            disabled
          >
            Coming Soon
          </Button>
        </div>

        <div className="grid gap-2">
          <h4 className="font-medium">Active Sessions</h4>
          <p className="text-sm text-muted-foreground">
            View and manage your active sessions
          </p>
          
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          ) : sessions?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions found</p>
          ) : (
            <div className="space-y-4">
              {sessions?.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {session.device_info || "Unknown Device"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      IP: {session.ip_address || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {format(new Date(session.last_active), "PPpp")}
                    </p>
                  </div>
                  {session.is_active && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => terminateSession.mutate(session.id)}
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}