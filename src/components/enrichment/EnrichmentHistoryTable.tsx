import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Download, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface Upload {
  id: string;
  original_filename: string;
  processed_status: string;
  total_rows: number;
  matched_rows: number;
  created_at: string;
  error_message: string | null;
  raw_data: Json;
  column_mapping: Json;
}

interface EnrichmentHistoryTableProps {
  uploads: Upload[];
  onDelete?: (id: string) => void;
}

export function EnrichmentHistoryTable({ uploads, onDelete }: EnrichmentHistoryTableProps) {
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const handleDownload = async (upload: Upload) => {
    try {
      // Get enriched data from master_leads
      const { data: enrichedData, error } = await supabase
        .from('master_leads')
        .select('*')
        .eq('original_upload_id', upload.id);

      if (error) throw error;

      // Convert to CSV
      const headers = ['company_name', 'matched_limited_partner_id', 'confidence_score', 'enriched_data'];
      const csvContent = [
        headers.join(','),
        ...enrichedData.map(row => [
          row.company_name,
          row.matched_limited_partner_id,
          row.confidence_score,
          JSON.stringify(row.enriched_data)
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enriched-${upload.original_filename}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your enriched data is being downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the enriched data.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_uploaded_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onDelete?.(id);
      toast({
        title: "Upload Deleted",
        description: "The upload has been successfully deleted.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the upload.",
        variant: "destructive",
      });
    }
  };

  const getEnrichmentAnalysis = (columnMapping: Json): string => {
    if (typeof columnMapping === 'object' && columnMapping !== null) {
      return (columnMapping as Record<string, unknown>).enrichment_analysis as string || 
        `Processed ${selectedUpload?.total_rows || 0} records with ${selectedUpload?.matched_rows || 0} successful matches 
        (${selectedUpload ? ((selectedUpload.matched_rows / selectedUpload.total_rows) * 100).toFixed(1) : 0}% match rate)`;
    }
    return `No analysis available`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Rows</TableHead>
              <TableHead>Matched</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Error</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No uploads found
                </TableCell>
              </TableRow>
            ) : (
              uploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">
                    {upload.original_filename}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(upload.processed_status || 'pending')}
                  </TableCell>
                  <TableCell>{upload.total_rows || 0}</TableCell>
                  <TableCell>{upload.matched_rows || 0}</TableCell>
                  <TableCell>
                    {format(new Date(upload.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-red-500">
                    {upload.error_message || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedUpload(upload)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(upload)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(upload.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUpload} onOpenChange={() => setSelectedUpload(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enrichment Results</DialogTitle>
          </DialogHeader>
          
          {selectedUpload && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">
                  {getEnrichmentAnalysis(selectedUpload.column_mapping)}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-2xl font-bold">
                      {selectedUpload.matched_rows}
                    </p>
                    <p className="text-sm text-muted-foreground">Matched Records</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-2xl font-bold">
                      {((selectedUpload.matched_rows / selectedUpload.total_rows) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Match Rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
