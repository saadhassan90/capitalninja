import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export function CampaignList() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          lists!campaigns_list_id_fkey (
            name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  if (!campaigns?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No campaigns created yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>List</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Recipients</TableHead>
          <TableHead>Success Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>{campaign.lists?.name}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(campaign.status)}>
                {campaign.status}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(campaign.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>{campaign.total_recipients}</TableCell>
            <TableCell>
              {campaign.total_recipients > 0
                ? `${Math.round(
                    (campaign.successful_sends / campaign.total_recipients) * 100
                  )}%`
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "outline";
    case "sending":
      return "default";
    case "scheduled":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
}