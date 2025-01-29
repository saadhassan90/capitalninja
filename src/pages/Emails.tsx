import { Card } from "@/components/ui/card";

export default function Emails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Manage your email campaigns with Instantly.ai
        </p>
      </div>

      <Card className="w-full h-[calc(100vh-12rem)] overflow-hidden">
        <iframe
          src="https://app.instantly.ai"
          className="w-full h-full border-0"
          title="Instantly.ai"
          allow="clipboard-write"
        />
      </Card>
    </div>
  );
}