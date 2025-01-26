import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { MenuHeader } from "./sidebar/MenuHeader";
import { MenuList } from "./sidebar/MenuList";
import { menuItems } from "./sidebar/MenuItems";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <MenuHeader />
        <SidebarGroup>
          <SidebarGroupContent>
            <MenuList items={menuItems} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}