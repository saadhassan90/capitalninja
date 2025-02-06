import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Investors from "@/pages/Investors";
import Lists from "@/pages/Lists";
import ListView from "@/pages/ListView";
import Raise from "@/pages/Raise";
import Team from "@/pages/Team";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Campaigns from "@/pages/Campaigns";
import CampaignDetails from "@/pages/CampaignDetails";
import Enrichment from "@/pages/Enrichment";
import Exports from "@/pages/Exports";
import Outreach from "@/pages/Outreach";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminActivity from "@/pages/admin/Activity";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
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
        path: "/team",
        element: <Team />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/campaigns",
        element: <Campaigns />,
      },
      {
        path: "/campaigns/:id",
        element: <CampaignDetails />,
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
        path: "/outreach",
        element: <Outreach />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/activity",
        element: <AdminActivity />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;