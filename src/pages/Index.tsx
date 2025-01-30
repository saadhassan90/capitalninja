import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const MainLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SidebarProvider defaultOpen={true} open={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen w-full">
          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
};

export default Index;