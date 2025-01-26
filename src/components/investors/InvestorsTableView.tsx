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
import { assetClassColors } from "@/utils/assetClassColors";

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

const getHeaderStyle = (type: keyof typeof assetClassColors) => {
  const colors = assetClassColors[type];
  return {
    color: colors.text,
    backgroundColor: colors.bg,
    borderRadius: '4px',
    padding: '4px 8px',
  };
};

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
      <div className="rounded-md border flex-1 overflow-auto max-h-[calc(100vh-300px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span style={getHeaderStyle('other')}>Name</span>
              </TableHead>
              <TableHead>
                <span style={getHeaderStyle('privateEquity')}>Type</span>
              </TableHead>
              <TableHead>
                <span style={getHeaderStyle('realEstate')}>AUM (USD M)</span>
              </TableHead>
              <TableHead>
                <span style={getHeaderStyle('infrastructure')}>Location</span>
              </TableHead>
              <TableHead>
                <span style={getHeaderStyle('venture')}>Investment Focus</span>
              </TableHead>
              <TableHead>
                <span style={getHeaderStyle('privateCredit')}>Min. Investment (USD M)</span>
              </TableHead>
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