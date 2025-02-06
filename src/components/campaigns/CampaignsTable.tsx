import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import type { SortConfig } from "@/types/sorting";
import { CampaignTableHeader } from "./table/CampaignTableHeader";
import { CampaignTableRow } from "./table/CampaignTableRow";

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
          ),
          raise:raise_id (
            name,
            id
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
            <CampaignTableHeader
              onSelectAll={handleSelectAll}
              allSelected={campaigns?.length > 0 && selectedCampaigns.length === campaigns.length}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </TableHeader>
          <TableBody>
            {!campaigns?.length ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <CampaignTableRow
                  key={campaign.id}
                  campaign={campaign}
                  selected={selectedCampaigns.includes(campaign.id)}
                  onSelect={handleSelectCampaign}
                  onEdit={onEdit}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}