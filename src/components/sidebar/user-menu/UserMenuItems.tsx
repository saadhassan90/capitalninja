import { Settings, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

interface UserMenuItemsProps {
  onLogout: () => Promise<void>;
}

export function UserMenuItems({ onLogout }: UserMenuItemsProps) {
  const { theme, setTheme } = useTheme();
  
  const menuItems = [
    { title: "Profile", url: "/profile", icon: UserRound },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
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