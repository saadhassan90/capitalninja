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
import { InvestorProfile } from "../InvestorProfile";
import { useState } from "react";
import type { InvestorContact } from "@/types/investor-contact";
import type { SortConfig } from "@/types/sorting";
import type { Campaign } from "@/types/campaign";

interface InvestorsTableViewProps {
  investors: InvestorContact[];
  isLoading: boolean;
  onViewInvestor: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
  selectedInvestors: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectInvestor: (id: string, checked: boolean) => void;
  listId?: string;
  campaign?: Campaign;
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
  listId,
  campaign,
}: InvestorsTableViewProps) {
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);

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

  const handleViewInvestor = (id: number) => {
    setSelectedInvestorId(id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-md border">
        <div className="overflow-auto max-h-[calc(100vh-380px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-xs font-medium">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all investors"
                  />
                </TableHead>
                <SortableHeader column="first_name">First Name</SortableHeader>
                <SortableHeader column="last_name">Last Name</SortableHeader>
                <SortableHeader column="email">Email</SortableHeader>
                <SortableHeader column="company_name">Company</SortableHeader>
                <SortableHeader column="title">Title</SortableHeader>
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
                    onViewInvestor={handleViewInvestor}
                    selected={selectedInvestors.includes(investor.id)}
                    onSelect={onSelectInvestor}
                    listId={listId}
                    campaign={campaign}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <InvestorsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {selectedInvestorId && (
        <InvestorProfile
          investorId={selectedInvestorId}
          open={selectedInvestorId !== null}
          onOpenChange={(open) => !open && setSelectedInvestorId(null)}
        />
      )}
    </div>
  );
}
