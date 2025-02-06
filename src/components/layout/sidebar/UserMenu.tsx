import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function UserMenu() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="px-2">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </Button>
    </div>
  );
}