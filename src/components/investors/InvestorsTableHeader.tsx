import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "./SortableHeader";
import type { SortConfig } from "@/types/sorting";
import type { LimitedPartner } from "@/types/investor";

interface InvestorsTableHeaderProps {
  investors: LimitedPartner[];
  selectedInvestors: number[];
  onSelectAll: (checked: boolean) => void;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function InvestorsTableHeader({
  investors,
  selectedInvestors,
  onSelectAll,
  sortConfig,
  onSort
}: InvestorsTableHeaderProps) {
  const allSelected = investors.length > 0 && investors.every(investor => 
    selectedInvestors.includes(investor.id)
  );

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px] text-xs font-medium">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all investors"
          />
        </TableHead>
        <SortableHeader column="limited_partner_name" sortConfig={sortConfig} onSort={onSort}>Name</SortableHeader>
        <SortableHeader column="limited_partner_type" sortConfig={sortConfig} onSort={onSort}>Type</SortableHeader>
        <SortableHeader column="aum" sortConfig={sortConfig} onSort={onSort}>AUM (USD M)</SortableHeader>
        <SortableHeader column="hqlocation" sortConfig={sortConfig} onSort={onSort}>Location</SortableHeader>
        <TableHead className="text-xs font-medium">Investment Focus</TableHead>
        <SortableHeader column="primary_contact" sortConfig={sortConfig} onSort={onSort}>Primary Contact</SortableHeader>
        <TableHead className="text-xs font-medium">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}