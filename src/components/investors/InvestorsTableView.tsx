import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { InvestorsTableRow } from "./InvestorsTableRow";
import { InvestorsPagination } from "./InvestorsPagination";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
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
  selectedInvestors: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectInvestor: (id: number, checked: boolean) => void;
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
  selectedInvestors,
  onSelectAll,
  onSelectInvestor,
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
  };

  const allSelected = investors.length > 0 && investors.every(investor => 
    selectedInvestors.includes(investor.id)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      <div className="flex-1 rounded-md border">
        <div className="relative h-full">
          {/* Fixed Header */}
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              <TableRow>
                <TableHead className="w-[50px] text-xs font-medium">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all investors"
                  />
                </TableHead>
                <SortableHeader column="limited_partner_name">Name</SortableHeader>
                <SortableHeader column="limited_partner_type">Type</SortableHeader>
                <SortableHeader column="aum">AUM (USD M)</SortableHeader>
                <SortableHeader column="hqlocation">Location</SortableHeader>
                <TableHead className="text-xs font-medium">Investment Focus</TableHead>
                <SortableHeader column="primary_contact">Primary Contact</SortableHeader>
                <TableHead className="text-xs font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          
          {/* Scrollable Body */}
          <div className="overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
            <Table>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm">Loading...</TableCell>
                  </TableRow>
                ) : investors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm">No investors found</TableCell>
                  </TableRow>
                ) : (
                  investors.map((investor) => (
                    <InvestorsTableRow 
                      key={investor.id}
                      investor={investor}
                      onViewInvestor={onViewInvestor}
                      selected={selectedInvestors.includes(investor.id)}
                      onSelect={onSelectInvestor}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t mt-4 py-2">
        <InvestorsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}