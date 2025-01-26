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
}

export function InvestorsTableView({ investors, isLoading, onViewInvestor }: InvestorsTableViewProps) {
  const renderFundTypes = (fundTypes: string | null) => {
    if (!fundTypes) return 'N/A';
    
    return fundTypes.split(',').map((type, index) => (
      <Badge key={index} variant="secondary" className="mr-1 mb-1">
        {type.trim()}
      </Badge>
    ));
  };

  return (
    <div className="rounded-md border">
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
  );
}