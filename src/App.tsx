import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Investors from "@/pages/Investors";
import Lists from "@/pages/Lists";
import ListView from "@/pages/ListView";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

// Create a root component that provides auth context
const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
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
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Root><Auth /></Root>,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;