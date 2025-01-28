import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function Layout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen w-full">
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}