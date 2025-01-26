import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true} open={true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col h-screen">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Index;