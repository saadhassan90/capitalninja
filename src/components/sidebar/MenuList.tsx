import { LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  url: string;
}

interface MenuListProps {
  items: MenuItem[];
}

export function MenuList({ items }: MenuListProps) {
  const location = useLocation();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = location.pathname === item.url;
        
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-900/10 dark:hover:bg-gray-50/10 ${
                  isActive
                    ? "bg-gray-900/10 dark:bg-gray-50/10 font-medium"
                    : ""
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}