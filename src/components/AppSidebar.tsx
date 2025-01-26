import { ChevronLeft, Home, Users, BookOpen, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Investors", icon: Users, url: "/" },
  { title: "Resources", icon: BookOpen, url: "/" },
  { title: "Settings", icon: Settings, url: "/" },
];

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between p-2">
          <span className={`font-semibold transition-opacity duration-200 ${state === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
            Menu
          </span>
          <SidebarTrigger className="h-8 w-8" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={state === 'collapsed' ? item.title : undefined}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}