import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Emails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Manage your email templates for campaigns
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email template management will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}