import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import type { SortConfig } from "@/types/sorting";

interface SortableHeaderProps {
  column: string;
  children: React.ReactNode;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function SortableHeader({ column, children, sortConfig, onSort }: SortableHeaderProps) {
  const isSorted = sortConfig.column === column;
  
  return (
    <TableHead 
      className="text-xs font-medium cursor-pointer hover:bg-muted/50"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {isSorted ? (
          sortConfig.direction === 'asc' ? 
            <ChevronUp className="h-3 w-3 text-muted-foreground" /> : 
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
        )}
      </div>
    </TableHead>
  );
}