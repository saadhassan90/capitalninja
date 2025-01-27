import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AuthPageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
          <img
            src="/lovable-uploads/f5a05f58-4b3d-4f7b-8f79-ce224a93999d.png"
            alt="CapitalNinja Logo"
            className="h-6 w-6"
          />
        </div>
        <span className="font-semibold text-lg">CapitalNinja</span>
      </div>
      
      <Button
        variant="ghost"
        asChild
      >
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </header>
  );
}