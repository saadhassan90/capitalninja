import { Home, Users, BookOpen, Settings, ListChecks } from "lucide-react";

export const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Investors", icon: Users, url: "/investors" },
  { title: "Lists", icon: ListChecks, url: "/lists" },
  { title: "Resources", icon: BookOpen, url: "/resources" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export const userMenuItems = [
  { title: "Profile", url: "/profile", icon: Users },
  { title: "Team", url: "/team", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];