
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
import Settings from "@/pages/Settings";
import Enrichment from "@/pages/Enrichment";
import Exports from "@/pages/Exports";
import Campaigns from "@/pages/Campaigns";
import CampaignView from "@/pages/CampaignView";
import Raise from "@/pages/Raise";
import Emails from "@/pages/Emails";
import AddEmail from "@/pages/AddEmail";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminActivity from "@/pages/admin/Activity";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Index />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "investors",
        element: <Investors />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "enrichment",
        element: <Enrichment />,
      },
      {
        path: "exports",
        element: <Exports />,
      },
      {
        path: "campaigns",
        element: <Campaigns />,
      },
      {
        path: "campaigns/:id",
        element: <CampaignView />,
      },
      {
        path: "raise",
        element: <Raise />,
      },
      {
        path: "emails",
        element: <Emails />,
      },
      {
        path: "emails/add",
        element: <AddEmail />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
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
    path: "auth",
    element: (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Auth />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    ),
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
