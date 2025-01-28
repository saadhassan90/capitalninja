import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Lists from "./pages/Lists";
import NewList from "./pages/NewList";
import EditList from "./pages/EditList";
import Campaigns from "./pages/Campaigns";
import NewCampaign from "./pages/NewCampaign";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import Notifications from "./pages/Notifications";
import Team from "./pages/Team";
import Billing from "./pages/Billing";

const queryClient = new QueryClient();

export function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/investors" element={<Investors />} />
                  <Route path="/lists" element={<Lists />} />
                  <Route path="/lists/new" element={<NewList />} />
                  <Route path="/lists/:id" element={<EditList />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/new" element={<NewCampaign />} />
                  <Route path="/settings" element={<Settings />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="security" element={<Security />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="team" element={<Team />} />
                    <Route path="billing" element={<Billing />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}