import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { AddToListDialog } from "./AddToListDialog";
import { X } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  selectedInvestors: string[];
  onClearSelection: () => void;
  listId?: string;
}

export function BulkActions({
  selectedCount,
  selectedInvestors,
  onClearSelection,
  listId,
}: BulkActionsProps) {
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);

  return (
    <div className="border border-border bg-card text-card-foreground rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Selected {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Clear selection
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddToListDialog(true)}
            className="h-8"
          >
            Add to List
          </Button>
        </div>
      </div>

      <AddToListDialog
        open={showAddToListDialog}
        onOpenChange={setShowAddToListDialog}
        selectedInvestors={selectedInvestors.map(id => parseInt(id))}
        listId={listId}
        onSuccess={() => {
          setShowAddToListDialog(false);
          onClearSelection();
        }}
      />
    </div>
  );
}
