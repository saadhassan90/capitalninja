import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const Index = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true} open={true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col h-screen">
            <header className="h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
              <div className="container h-full flex items-center">
                <Breadcrumbs />
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Index;