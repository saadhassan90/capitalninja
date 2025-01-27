import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

interface TestLoginButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function TestLoginButton({ loading, onClick }: TestLoginButtonProps) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            For testing only
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onClick}
        disabled={loading}
      >
        <Bug className="mr-2" />
        Test Login (Dev Only)
      </Button>
    </>
  );
}