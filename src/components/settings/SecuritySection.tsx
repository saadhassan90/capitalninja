import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SecuritySection() {
  const { user } = useAuth();
  const { toast } = useToast();

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