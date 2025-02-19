
import { Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AdminButton() {
  const { user } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('is_active')
          .eq('id', user?.id)
          .single();
        
        if (error) {
          console.error('Admin check error:', error);
          return false;
        }
        
        return data?.is_active || false;
      } catch (error) {
        console.error('Admin check error:', error);
        return false;
      }
    },
    enabled: !!user,
    retry: false
  });

  if (!isAdmin) return null;

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-[hsl(var(--sidebar-accent))]"
      asChild
    >
      <Link to="/admin">
        <Shield className="mr-2 h-4 w-4" />
        Admin Console
      </Link>
    </Button>
  );
}
