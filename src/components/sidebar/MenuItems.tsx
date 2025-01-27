import { Home, Users, ListChecks, BookOpen, FileText } from "lucide-react";

export const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Investors", icon: Users, url: "/investors" },
  { title: "Lists", icon: ListChecks, url: "/lists" },
  { title: "Enrichment", icon: BookOpen, url: "/enrichment" },
  { title: "Exports", icon: FileText, url: "/exports" },
];

export const userMenuItems = [
  { title: "Profile", url: "/profile", icon: Users },
  { title: "Team", url: "/team", icon: Users },
];