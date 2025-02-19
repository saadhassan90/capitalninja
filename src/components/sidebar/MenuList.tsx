
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

  const getValidHref = (href?: string): string => {
    // If href is undefined or empty, return home route
    if (!href || href.trim() === '') {
      return '/';
    }
    
    // Remove any trailing slashes and ensure starts with /
    const cleanHref = href.trim().replace(/\/+$/, '');
    return cleanHref.startsWith('/') ? cleanHref : `/${cleanHref}`;
  };

  const isActiveRoute = (href?: string): boolean => {
    if (!href) return location.pathname === '/';
    const validHref = getValidHref(href);
    return location.pathname === validHref;
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
                {item.items.map((subItem, subIndex) => {
                  const href = getValidHref(subItem.href);
                  return (
                    <Button
                      key={subIndex}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-colors",
                        "hover:bg-accent/50",
                        isActiveRoute(subItem.href) && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      asChild
                    >
                      <Link to={href}>
                        {subItem.icon && (
                          <subItem.icon className="mr-2 h-4 w-4" />
                        )}
                        {subItem.title}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        }

        const href = getValidHref(item.href);
        return (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full justify-start transition-colors",
              "hover:bg-accent/50",
              isActiveRoute(item.href) && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            asChild
          >
            <Link to={href}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
