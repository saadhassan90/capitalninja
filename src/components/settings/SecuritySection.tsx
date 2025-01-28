import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SecuritySection() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        user?.email || "",
        {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        }
      );
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <h4 className="font-medium">Email Address</h4>
          <p className="text-sm text-muted-foreground">
            {user?.email}
            {user?.email_confirmed_at ? (
              <span className="ml-2 text-green-600">(Verified)</span>
            ) : (
              <span className="ml-2 text-yellow-600">(Not verified)</span>
            )}
          </p>
        </div>

        <div className="grid gap-2">
          <h4 className="font-medium">Password</h4>
          <p className="text-sm text-muted-foreground">
            Change your password to keep your account secure
          </p>
          <Button 
            variant="outline" 
            onClick={handlePasswordReset}
          >
            Change Password
          </Button>
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
            Manage your active sessions and sign out from other devices
          </p>
          <Button 
            variant="outline" 
            disabled
          >
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
}