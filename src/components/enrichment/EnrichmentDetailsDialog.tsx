import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Json } from "@/integrations/supabase/types";

interface EnrichmentDetailsDialogProps {
  upload: {
    total_rows: number;
    matched_rows: number;
    column_mapping: Json;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrichmentDetailsDialog({ upload, open, onOpenChange }: EnrichmentDetailsDialogProps) {
  const getEnrichmentAnalysis = (columnMapping: Json): string => {
    if (typeof columnMapping === 'object' && columnMapping !== null) {
      return (columnMapping as Record<string, unknown>).enrichment_analysis as string || 
        `Processed ${upload?.total_rows || 0} records with ${upload?.matched_rows || 0} successful matches 
        (${upload ? ((upload.matched_rows / upload.total_rows) * 100).toFixed(1) : 0}% match rate)`;
    }
    return `No analysis available`;
  };

  if (!upload) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enrichment Results</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">
              {getEnrichmentAnalysis(upload.column_mapping)}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-2xl font-bold">
                  {upload.matched_rows}
                </p>
                <p className="text-sm text-muted-foreground">Matched Records</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-2xl font-bold">
                  {((upload.matched_rows / upload.total_rows) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Match Rate</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}