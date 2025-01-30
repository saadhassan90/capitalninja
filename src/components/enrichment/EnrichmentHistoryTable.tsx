import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { EnrichmentStatusBadge } from "./EnrichmentStatusBadge";
import { EnrichmentActions } from "./EnrichmentActions";
import { EnrichmentDetailsDialog } from "./EnrichmentDetailsDialog";
import { useState } from "react";

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

  const handleDownload = async (upload: Upload) => {
    try {
      const { data: enrichedData, error } = await supabase
        .from('master_leads')
        .select('*')
        .eq('original_upload_id', upload.id);

      if (error) throw error;

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
                    <EnrichmentStatusBadge status={upload.processed_status || 'pending'} />
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
                    <EnrichmentActions
                      onView={() => setSelectedUpload(upload)}
                      onDownload={() => handleDownload(upload)}
                      onDelete={() => handleDelete(upload.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EnrichmentDetailsDialog
        upload={selectedUpload}
        open={!!selectedUpload}
        onOpenChange={(open) => !open && setSelectedUpload(null)}
      />
    </>
  );
}