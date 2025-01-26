import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const renderFundTypes = (fundTypes: string | null) => {
    if (!fundTypes) return 'N/A';
    
    return fundTypes.split(',').map((type, index) => (
      <Badge key={index} variant="secondary" className="mr-1 mb-1">
        {type.trim()}
      </Badge>
    ));
  };

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
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.limited_partner_name}</TableCell>
                  <TableCell>{investor.limited_partner_type || 'N/A'}</TableCell>
                  <TableCell>{investor.aum ? `${(investor.aum / 1e6).toFixed(0)}` : 'N/A'}</TableCell>
                  <TableCell>{investor.hqlocation || 'N/A'}</TableCell>
                  <TableCell className="flex flex-wrap gap-1">
                    {renderFundTypes(investor.preferred_fund_type)}
                  </TableCell>
                  <TableCell>
                    {investor.preferred_commitment_size_min 
                      ? `${(investor.preferred_commitment_size_min / 1e6).toFixed(0)}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewInvestor(investor.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage);
                return distance === 0 || distance === 1 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <span className="px-4">...</span>
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}