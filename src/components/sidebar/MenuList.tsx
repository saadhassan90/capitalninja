
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
    if (href === '/' && location.pathname === '/') return true;
    if (href === '/') return false;
    return location.pathname.startsWith(href);
  };

  const sanitizeHref = (href?: string): string => {
    // If no href provided, default to home
    if (!href) return '/';
    
    // Remove any leading/trailing whitespace
    const trimmedHref = href.trim();
    
    // If empty after trim, return home
    if (!trimmedHref) return '/';
    
    // Ensure single leading slash and no trailing slash (unless root)
    const normalizedHref = trimmedHref.startsWith('/') ? trimmedHref : `/${trimmedHref}`;
    return normalizedHref === '/' ? normalizedHref : normalizedHref.replace(/\/+$/, '');
  };

  const renderMenuItem = (item: MenuItem) => {
    const href = sanitizeHref(item.href);
    
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start transition-colors",
          "hover:bg-accent/50",
          isActiveRoute(href) && "bg-primary text-primary-foreground hover:bg-primary/90"
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
