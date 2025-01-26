import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { InvestorsTable } from "@/components/InvestorsTable";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investor Directory</h1>
              <p className="text-gray-500 mt-1">Find and connect with investors</p>
            </div>
            <SidebarTrigger />
          </div>
          <InvestorsTable />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;