import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Lists from "./pages/Lists";
import Campaigns from "./pages/Campaigns";
import NewCampaign from "./pages/NewCampaign";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/new" element={<NewCampaign />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </AuthProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}