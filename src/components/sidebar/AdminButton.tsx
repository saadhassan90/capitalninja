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
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user?.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user
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