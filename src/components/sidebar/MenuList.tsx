import { LucideIcon } from "lucide-react";
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
  isCollapsed: boolean;
}

export function MenuList({ items, isCollapsed }: MenuListProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
            <a href={item.url} className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}