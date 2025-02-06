import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import type { Campaign } from "@/types/campaign";
import type { SortConfig } from "@/types/sorting";

interface CampaignsTableProps {
  onEdit?: (campaign: Campaign) => void;
}

export function CampaignsTable({ onEdit }: CampaignsTableProps) {
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'created_at',
    direction: 'desc'
  });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', sortConfig],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          lists (
            name
          )
        `)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      
      if (error) throw error;
      return data as Campaign[];
    },
  });

  const handleSort = (column: string) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = (campaigns || []).map(campaign => campaign.id);
      setSelectedCampaigns(allIds);
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(prev => [...prev, id]);
    } else {
      setSelectedCampaigns(prev => prev.filter(campaignId => campaignId !== id));
    }
  };

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

  const SortableHeader = ({ column, children }: { column: string, children: React.ReactNode }) => {
    const isSorted = sortConfig.column === column;
    
    return (
      <TableHead 
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => handleSort(column)}
      >
        <div className="flex items-center gap-1">
          {children}
          {isSorted ? (
            sortConfig.direction === 'asc' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </div>
      </TableHead>
    );
  };

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="space-y-4">
      {selectedCampaigns.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {}}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={campaigns?.length > 0 && selectedCampaigns.length === campaigns.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="subject">Subject</SortableHeader>
              <TableHead>List</TableHead>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="created_at">Created</SortableHeader>
              <TableHead>Recipients</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!campaigns?.length ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.subject}</TableCell>
                  <TableCell>{campaign.lists?.name}</TableCell>
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
                      `${Math.round((campaign.successful_sends || 0 / campaign.total_recipients) * 100)}%` : 
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
