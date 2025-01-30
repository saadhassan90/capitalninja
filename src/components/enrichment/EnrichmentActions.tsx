import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 } from "lucide-react";

interface EnrichmentActionsProps {
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function EnrichmentActions({ onView, onDownload, onDelete }: EnrichmentActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={onView}>
        <Eye className="h-4 w-4" />
        View
      </Button>
      <Button variant="secondary" size="sm" onClick={onDownload}>
        <Download className="h-4 w-4" />
        Download
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}