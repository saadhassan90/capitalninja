import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Emails() {
  const [loading, setLoading] = useState(true);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Manage your email campaigns with Instantly.ai
        </p>
      </div>

      <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <iframe
          src="https://app.instantly.ai"
          className="w-full h-full border-0"
          title="Instantly.ai"
          allow="clipboard-write"
          onLoad={handleIframeLoad}
        />
      </Card>
    </div>
  );
}