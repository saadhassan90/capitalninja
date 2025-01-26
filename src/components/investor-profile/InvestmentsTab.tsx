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
    <Card>
      <CardHeader>
        <CardTitle>Direct Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Deal Size</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No direct investments found</TableCell>
              </TableRow>
            ) : (
              investments.map((investment, index) => (
                <TableRow key={index}>
                  <TableCell>{investment.company_name}</TableCell>
                  <TableCell>
                    {investment.deal_size 
                      ? `$${(investment.deal_size / 1e6).toFixed(0)}M` 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
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
  );
}