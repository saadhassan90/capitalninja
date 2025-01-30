import { Badge } from "@/components/ui/badge";

interface EnrichmentStatusBadgeProps {
  status: string;
}

export function EnrichmentStatusBadge({ status }: EnrichmentStatusBadgeProps) {
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
}