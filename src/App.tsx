import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "sonner";
import { queryClient } from "./lib/react-query";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppSidebar } from "./components/layout/AppSidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignSetup from "./pages/CampaignSetup";
import Lists from "./pages/Lists";
import Raises from "./pages/Raises";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppSidebar />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/:id" element={<CampaignSetup />} />
                  <Route path="/lists" element={<Lists />} />
                  <Route path="/raises" element={<Raises />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;