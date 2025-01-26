import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, onClearSelection }: BulkActionsProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md ml-auto">
      <span className="text-sm font-medium">
        {selectedCount} investor{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <Button
          className="bg-black hover:bg-black/80"
          size="sm"
          onClick={() => {
            // Add bulk actions here
            console.log('Add to list clicked');
          }}
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
    </div>
  );
}