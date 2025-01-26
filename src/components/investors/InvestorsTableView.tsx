import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvestorsTableRow } from "./InvestorsTableRow";
import { InvestorsPagination } from "./InvestorsPagination";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LimitedPartner } from "@/types/investor";
import type { SortConfig } from "@/types/sorting";

interface InvestorsTableViewProps {
  investors: LimitedPartner[];
  isLoading: boolean;
  onViewInvestor: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function InvestorsTableView({ 
  investors, 
  isLoading, 
  onViewInvestor,
  currentPage,
  totalPages,
  onPageChange,
  sortConfig,
  onSort,
}: InvestorsTableViewProps) {
  const SortableHeader = ({ column, children }: { column: string, children: React.ReactNode }) => {
    const isSorted = sortConfig.column === column;
    
    return (
      <TableHead 
        className="text-xs font-medium cursor-pointer hover:bg-muted/50"
        onClick={() => onSort(column)}
      >
        <div className="flex items-center gap-1">
          {children}
          {isSorted && (
            sortConfig.direction === 'asc' ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </TableHead>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-md border flex-1 overflow-auto max-h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="limited_partner_name">Name</SortableHeader>
              <SortableHeader column="limited_partner_type">Type</SortableHeader>
              <SortableHeader column="aum">AUM (USD M)</SortableHeader>
              <SortableHeader column="hqlocation">Location</SortableHeader>
              <TableHead className="text-xs font-medium">Investment Focus</TableHead>
              <SortableHeader column="primary_contact">Primary Contact</SortableHeader>
              <TableHead className="text-xs font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm">Loading...</TableCell>
              </TableRow>
            ) : investors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm">No investors found</TableCell>
              </TableRow>
            ) : (
              investors.map((investor) => (
                <InvestorsTableRow 
                  key={investor.id}
                  investor={investor}
                  onViewInvestor={onViewInvestor}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <InvestorsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}