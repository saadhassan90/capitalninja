
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import { ListsTable } from "@/components/lists/ListsTable";

export default function Lists() {
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
          <p className="text-muted-foreground">
            Create and manage your investor lists
          </p>
        </div>
        <Button onClick={() => setShowNewListDialog(true)}>
          <ListPlus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>

      <ListsTable />
    </div>
  );
}
