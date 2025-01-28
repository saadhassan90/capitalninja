import { Home, Users, ListChecks, Sparkles, Download, UserCircle } from "lucide-react";

export const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Profile", icon: UserCircle, url: "/profile" },
  { title: "Investors", icon: Users, url: "/investors" },
  { title: "Lists", icon: ListChecks, url: "/lists" },
  { title: "Enrichment", icon: Sparkles, url: "/enrichment" },
  { title: "Exports", icon: Download, url: "/exports" },
];

export const userMenuItems = [
  { title: "Profile", url: "/profile", icon: Users },
  { title: "Team", url: "/team", icon: Users },
];