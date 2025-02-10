
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Investors from "@/pages/Investors";
import Lists from "@/pages/Lists";
import ListView from "@/pages/ListView";
import Settings from "@/pages/Settings";
import Enrichment from "@/pages/Enrichment";
import Exports from "@/pages/Exports";
import Campaigns from "@/pages/Campaigns";
import CampaignView from "@/pages/CampaignView";
import Raise from "@/pages/Raise";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminActivity from "@/pages/admin/Activity";

const queryClient = new QueryClient();

const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root><Index /></Root>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/investors",
        element: <Investors />,
      },
      {
        path: "/lists",
        element: <Lists />,
      },
      {
        path: "/lists/:id",
        element: <ListView />,
      },
      {
        path: "/raise",
        element: <Raise />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/enrichment",
        element: <Enrichment />,
      },
      {
        path: "/exports",
        element: <Exports />,
      },
      {
        path: "/campaigns",
        element: <Campaigns />,
      },
      {
        path: "/campaigns/:id",
        element: <CampaignView />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "activity",
            element: <AdminActivity />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Root><Auth /></Root>,
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
