import { User, Settings, LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface UserMenuItemsProps {
  onLogout: () => Promise<void>;
}

export function UserMenuItems({ onLogout }: UserMenuItemsProps) {
  const menuItems = [
    { title: "Profile", url: "/settings", icon: User },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
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
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-[hsl(var(--sidebar-accent))]"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}