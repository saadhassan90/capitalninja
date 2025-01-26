import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { MenuHeader } from "./sidebar/MenuHeader";
import { MenuList } from "./sidebar/MenuList";
import { menuItems } from "./sidebar/MenuItems";

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar>
      <SidebarContent>
        <MenuHeader isCollapsed={isCollapsed} />
        <SidebarGroup>
          <SidebarGroupContent>
            <MenuList items={menuItems} isCollapsed={isCollapsed} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}