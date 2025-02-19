
import {
  LayoutDashboard,
  Users,
  List,
  Settings,
  Sparkles,
  Download,
  Shield,
  Activity,
  Send,
  Mail,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const menuItems = [
  {
    title: "Database",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Investors",
        href: "/investors",
        icon: Users,
      },
      {
        title: "Lists",
        href: "/lists",
        icon: List,
      },
      {
        title: "Enrichment",
        href: "/enrichment",
        icon: Sparkles,
      },
      {
        title: "Exports",
        href: "/exports",
        icon: Download,
      },
    ],
  },
  {
    title: "Outreach",
    items: [
      {
        title: "Raise",
        href: "/raise",
        icon: Briefcase,
      },
      {
        title: "Campaigns",
        href: "/campaigns",
        icon: Send,
      },
      {
        title: "Email Accounts",
        href: "/emails",
        icon: Mail,
      },
    ],
  },
];

const adminMenuItems = {
  title: "Admin",
  items: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Shield,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Activity",
      href: "/admin/activity",
      icon: Activity,
    },
  ],
};

export function useMenuItems() {
  const { user } = useAuth();

  const { data: isAdmin = false } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      try {
        const { data } = await supabase
          .from('admin_users')
          .select('is_active')
          .eq('id', user.id)
          .maybeSingle();
        
        return !!data?.is_active;
      } catch (error) {
        console.error('Admin check error:', error);
        return false;
      }
    },
    enabled: !!user,
    retry: false
  });

  return isAdmin ? [...menuItems, adminMenuItems] : menuItems;
}
