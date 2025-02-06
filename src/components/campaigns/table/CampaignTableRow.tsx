import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Campaign } from "@/types/campaign";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CampaignTableRowProps {
  campaign: Campaign;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit?: (campaign: Campaign) => void;
}

export function CampaignTableRow({ campaign, selected, onSelect }: CampaignTableRowProps) {
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id);

      if (error) throw error;
      toast.success("Campaign deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
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
      <TableCell>{campaign.raise?.name || '-'}</TableCell>
      <TableCell>{campaign.lists?.name || '-'}</TableCell>
      <TableCell>
        <Badge variant={getStatusColor(campaign.status)}>
          {campaign.status}
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(campaign.created_at), "MMM d, yyyy")}
      </TableCell>
      <TableCell>
        {campaign.sent_at ? format(new Date(campaign.sent_at), "MMM d, yyyy") : '-'}
      </TableCell>
      <TableCell>0</TableCell>
      <TableCell>0</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Open
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the campaign
                  "{campaign.name}" and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}