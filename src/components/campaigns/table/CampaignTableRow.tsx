import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Trash } from "lucide-react";
import { format } from "date-fns";
import type { Campaign } from "@/types/campaign";
import { useNavigate } from "react-router-dom";

interface CampaignTableRowProps {
  campaign: Campaign;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit?: (campaign: Campaign) => void;
}

export function CampaignTableRow({
  campaign,
  selected,
  onSelect,
  onEdit,
}: CampaignTableRowProps) {
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(campaign.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>{campaign.name}</TableCell>
      <TableCell>{campaign.raise?.name || '-'}</TableCell>
      <TableCell>{campaign.lists?.name || '-'}</TableCell>
      <TableCell>{campaign.status}</TableCell>
      <TableCell>
        {campaign.created_at ? format(new Date(campaign.created_at), 'MMM d, yyyy') : '-'}
      </TableCell>
      <TableCell>
        {campaign.sent_at ? format(new Date(campaign.sent_at), 'MMM d, yyyy') : '-'}
      </TableCell>
      <TableCell>0</TableCell>
      <TableCell>0</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Open campaign</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete campaign</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}