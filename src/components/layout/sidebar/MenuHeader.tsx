import { SidebarHeader } from "@/components/ui/sidebar";

export function MenuHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center gap-2 px-2">
        <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
        <span className="font-semibold">Lovable</span>
      </div>
    </SidebarHeader>
  );
}