import { useState } from "react";
import { ChevronDown, User, Settings, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const menuItems = [
  { title: "Profile", url: "/settings", icon: User },
  { title: "Team", url: "/settings?tab=team", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

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

  const userInitials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "??";

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.company_name || user?.email?.split("@")[0] || "User";

  return (
    <SidebarFooter className="border-t border-border/50">
      <div className="relative px-2 py-2">
        <div
          className={cn(
            "absolute bottom-full left-0 right-0 w-full overflow-hidden transition-all duration-200 ease-out bg-[hsl(var(--sidebar-muted))] border border-[hsl(var(--sidebar-border))] rounded-md",
            isOpen ? "mb-2 max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-[hsl(var(--sidebar-accent))]"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md p-2 hover:bg-[hsl(var(--sidebar-accent))]"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium text-[hsl(var(--sidebar-foreground))]">{displayName}</span>
              <span className="text-xs text-[hsl(var(--sidebar-muted-foreground))]">{user?.email}</span>
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
