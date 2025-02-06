import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import type { Campaign } from "@/types/campaign";

interface CampaignTableRowProps {
  campaign: Campaign;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit?: (campaign: Campaign) => void;
}

export function CampaignTableRow({ campaign, selected, onSelect, onEdit }: CampaignTableRowProps) {
  const getStatusColor = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'sending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={selected}
          onCheckedChange={(checked) => onSelect(campaign.id, checked as boolean)}
        />
      </TableCell>
      <TableCell className="font-medium">{campaign.name}</TableCell>
      <TableCell>{campaign.subject}</TableCell>
      <TableCell>{campaign.lists?.name}</TableCell>
      <TableCell>{campaign.raise?.name || '-'}</TableCell>
      <TableCell>
        <Badge variant={getStatusColor(campaign.status)}>
          {campaign.status}
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(campaign.created_at), "MMM d, yyyy")}
      </TableCell>
      <TableCell>{campaign.total_recipients || 0}</TableCell>
      <TableCell>
        {campaign.total_recipients ? 
          `${Math.round(((campaign.successful_sends || 0) / campaign.total_recipients) * 100)}%` : 
          '-'
        }
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(campaign)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}