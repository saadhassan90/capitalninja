import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { InvestmentsTabProps } from "@/types/investor-profile";

export function InvestmentsTab({ investments, investor }: InvestmentsTabProps) {
  const totalInvestments = investments.reduce(
    (sum, investment) => sum + (investment.deal_size || 0),
    0
  );

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col">
      <Card className="w-full flex-1">
        <CardHeader>
          <CardTitle className="text-base font-medium">Direct Investments</CardTitle>
          <CardDescription>
            View all direct investments made by {investor.limited_partner_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Deal Size (USD)</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No direct investments found
                    </TableCell>
                  </TableRow>
                ) : (
                  investments.map((investment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {investment.company_name}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(investment.deal_size)}
                      </TableCell>
                      <TableCell>
                        {investment.deal_date
                          ? new Date(investment.deal_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}