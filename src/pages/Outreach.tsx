import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Plus } from "lucide-react";

const Outreach = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Outreach</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Create New Campaign
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Start Fresh</div>
            <p className="text-xs text-muted-foreground">
              Create a new email campaign from scratch
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Use Template
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Quick Start</div>
            <p className="text-xs text-muted-foreground">
              Choose from our pre-built campaign templates
            </p>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Import Campaign
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Import</div>
            <p className="text-xs text-muted-foreground">
              Import an existing campaign setup
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
          <div className="text-muted-foreground text-sm text-center py-8">
            No campaigns created yet. Start by creating a new campaign above.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outreach;