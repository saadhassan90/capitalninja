import { TableHead, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { SortConfig } from "@/types/sorting";

interface CampaignTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function CampaignTableHeader({ onSelectAll, allSelected, sortConfig, onSort }: CampaignTableHeaderProps) {
  const SortableHeader = ({ column, children }: { column: string, children: React.ReactNode }) => {
    const isSorted = sortConfig.column === column;
    
    return (
      <TableHead 
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => onSort(column)}
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

  return (
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox 
          checked={allSelected}
          onCheckedChange={onSelectAll}
        />
      </TableHead>
      <SortableHeader column="name">Name</SortableHeader>
      <SortableHeader column="subject">Subject</SortableHeader>
      <TableHead>List</TableHead>
      <TableHead>Raise</TableHead>
      <SortableHeader column="status">Status</SortableHeader>
      <SortableHeader column="created_at">Created</SortableHeader>
      <TableHead>Recipients</TableHead>
      <TableHead>Success Rate</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
}