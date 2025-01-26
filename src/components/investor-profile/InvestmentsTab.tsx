import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DirectInvestment = {
  company_name: string;
  deal_size: number | null;
  deal_date: string | null;
};

export function InvestmentsTab({ investments }: { investments: DirectInvestment[] }) {
  return (
    <div className="h-[600px] overflow-y-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Direct Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Deal Size</TableHead>
                <TableHead className="text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm">No direct investments found</TableCell>
                </TableRow>
              ) : (
                investments.map((investment, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">{investment.company_name}</TableCell>
                    <TableCell className="text-sm">
                      {investment.deal_size 
                        ? `$${(investment.deal_size / 1e6).toFixed(0)}M` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {investment.deal_date 
                        ? new Date(investment.deal_date).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}