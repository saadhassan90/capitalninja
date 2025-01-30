import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Upload {
  id: string;
  original_filename: string;
  processed_status: string;
  total_rows: number;
  matched_rows: number;
  created_at: string;
  error_message: string | null;
}

interface EnrichmentHistoryTableProps {
  uploads: Upload[];
}

export function EnrichmentHistoryTable({ uploads }: EnrichmentHistoryTableProps) {
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

  return (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {uploads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}