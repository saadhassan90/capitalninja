import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AddToListDialog } from "./AddToListDialog";

interface BulkActionsProps {
  selectedCount: number;
  selectedInvestors: number[];
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, selectedInvestors, onClearSelection }: BulkActionsProps) {
  const [showAddToList, setShowAddToList] = useState(false);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md ml-auto">
      <span className="text-sm font-medium">
        {selectedCount} investor{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <Button
          className="bg-black hover:bg-black/80"
          size="sm"
          onClick={() => setShowAddToList(true)}
        >
          Add to List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <AddToListDialog
        open={showAddToList}
        onOpenChange={setShowAddToList}
        selectedInvestors={selectedInvestors}
        onSuccess={onClearSelection}
      />
    </div>
  );
}