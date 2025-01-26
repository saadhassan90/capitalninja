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

type LimitedPartner = {
  id: number;
  limited_partner_name: string;
  limited_partner_type: string | null;
  aum: number | null;
  hqlocation: string | null;
  preferred_fund_type: string | null;
  preferred_commitment_size_min: number | null;
};

interface InvestorsTableViewProps {
  investors: LimitedPartner[];
  isLoading: boolean;
  onViewInvestor: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InvestorsTableView({ 
  investors, 
  isLoading, 
  onViewInvestor,
  currentPage,
  totalPages,
  onPageChange,
}: InvestorsTableViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="rounded-md border flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>AUM (USD M)</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Investment Focus</TableHead>
              <TableHead>Min. Investment (USD M)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : investors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No investors found</TableCell>
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

      <InvestorsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}