import { SidebarTrigger } from "@/components/ui/sidebar";

interface MenuHeaderProps {
  isCollapsed: boolean;
}

export function MenuHeader({ isCollapsed }: MenuHeaderProps) {
  return (
    <div className="flex items-center justify-between p-2">
      <span className={`font-semibold transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        Menu
      </span>
      <SidebarTrigger className="h-8 w-8" />
    </div>
  );
}