
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMenuItems } from "./MenuItems";
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  href?: string;
  icon?: any;
  items?: MenuItem[];
}

interface MenuListProps {
  items?: MenuItem[];
}

export function MenuList({ items: propItems }: MenuListProps) {
  const location = useLocation();
  const items = propItems || useMenuItems();

  const isActiveRoute = (href?: string): boolean => {
    if (!href) return false;
    const cleanHref = sanitizeHref(href);
    if (cleanHref === "/" && location.pathname === "/") return true;
    if (cleanHref === "/") return false;
    return location.pathname.startsWith(cleanHref);
  };

  const sanitizeHref = (href?: string): string => {
    if (!href || href.trim() === "") return "/";
    
    // Normalize slashes and ensure proper format
    const normalized = href.trim()
      .replace(/\/+/g, "/")  // Replace multiple slashes with single slash
      .replace(/\/$/, "");   // Remove trailing slash unless root
      
    return normalized === "" ? "/" : normalized.startsWith("/") ? normalized : `/${normalized}`;
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!item.href) return null;
    
    const href = sanitizeHref(item.href);
    const isActive = isActiveRoute(href);
    
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start transition-colors",
          "hover:bg-accent/50",
          isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        asChild
      >
        <Link to={href}>
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.title}
        </Link>
      </Button>
    );
  };

  return (
    <nav className="space-y-6">
      {items.map((item, index) => {
        if (item.items) {
          return (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-xs text-muted-foreground px-4 uppercase tracking-wider">
                {item.title}
              </h4>
              <div className="space-y-1">
                {item.items.map((subItem, subIndex) => (
                  <React.Fragment key={subIndex}>
                    {renderMenuItem(subItem)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        }

        return <React.Fragment key={index}>{renderMenuItem(item)}</React.Fragment>;
      })}
    </nav>
  );
}
