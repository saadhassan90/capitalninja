import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function AdminButton() {
  return (
    <div className="px-2">
      <Button variant="ghost" className="w-full justify-start gap-2">
        <Shield className="h-4 w-4" />
        <span>Admin</span>
      </Button>
    </div>
  );
}