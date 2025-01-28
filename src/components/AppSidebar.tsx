import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MenuHeader } from "./sidebar/MenuHeader";
import { MenuList } from "./sidebar/MenuList";
import { menuItems } from "./sidebar/MenuItems";
import { UserMenu } from "./sidebar/UserMenu";
import { AdminButton } from "./sidebar/AdminButton";

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
      <SidebarFooter className="space-y-2">
        <AdminButton />
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}