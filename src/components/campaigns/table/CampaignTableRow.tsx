
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

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on buttons or checkbox
    if (
      e.target instanceof HTMLElement && 
      (e.target.closest('button') || e.target.closest('label'))
    ) {
      return;
    }
    navigate(`/campaigns/${campaign.id}`);
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={handleRowClick}
    >
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(campaign.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>{campaign.name}</TableCell>
      <TableCell>{campaign.raise?.name || '-'}</TableCell>
      <TableCell>-</TableCell>
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
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
