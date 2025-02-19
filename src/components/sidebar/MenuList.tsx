
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
    return location.pathname.startsWith(href);
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
                    <Link to={subItem.href || '/'}>
                      {subItem.icon && (
                        <subItem.icon className="mr-2 h-4 w-4" />
                      )}
                      {subItem.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          );
        }

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
            <Link to={item.href || '/'}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
