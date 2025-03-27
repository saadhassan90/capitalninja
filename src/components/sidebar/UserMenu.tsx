
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { SidebarFooter } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserAvatar } from "./user-menu/UserAvatar";
import { UserMenuItems } from "./user-menu/UserMenuItems";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Hardcoded user details as requested
  const userInitials = "JD";
  const displayName = "John Doe";
  const userEmail = "johndoe@capitalninja.ai";

  return (
    <SidebarFooter className="border-t border-border/50">
      <div className="relative px-2 py-2">
        <div
          className={cn(
            "absolute bottom-full left-0 right-0 w-full overflow-hidden transition-all duration-200 ease-out bg-[hsl(var(--sidebar-muted))] border border-[hsl(var(--sidebar-border))] rounded-md",
            isOpen ? "mb-2 max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <UserMenuItems onLogout={handleLogout} />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md p-2 hover:bg-[hsl(var(--sidebar-accent))]"
        >
          <div className="flex items-center gap-3">
            <UserAvatar 
              avatarUrl="/lovable-uploads/9ba6b591-1361-4aef-af76-1c6fcd0911b0.png" 
              userInitials={userInitials} 
            />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium text-[hsl(var(--sidebar-foreground))]">
                {displayName}
              </span>
              <span className="text-xs text-[hsl(var(--sidebar-muted-foreground))]">
                {userEmail}
              </span>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 ease-out text-[hsl(var(--sidebar-muted-foreground))]",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>
    </SidebarFooter>
  );
}
