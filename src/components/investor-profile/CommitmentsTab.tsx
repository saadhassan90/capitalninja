import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/integrations/supabase/types";

type FundCommitment = {
  fund_name: string;
  commitment: number | null;
  commitment_date: string | null;
};

type CommitmentsTabProps = {
  commitments: FundCommitment[];
  investor: Tables<"limited_partners">;
};

export function CommitmentsTab({ commitments, investor }: CommitmentsTabProps) {
  const fundActivityData = [
    { label: "Private Equity Funds", value: investor.total_commitments_in_pefunds },
    { label: "Venture Capital Funds", value: investor.total_commitments_in_vcfunds },
    { label: "Real Estate Funds", value: investor.total_commitments_in_refunds },
    { label: "Debt Funds", value: investor.total_commitments_in_debt_funds },
    { label: "Fund of Funds & Secondaries", value: investor.total_commitments_in_fofs_and2nd },
    { label: "Infrastructure Funds", value: investor.total_commitments_in_infrastructure },
    { label: "Energy Funds", value: investor.total_commitments_in_energy_funds },
    { label: "Other Funds", value: investor.total_commitments_in_other_funds },
  ];

  return (
    <div className="h-[600px] overflow-y-auto space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Fund Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {fundActivityData.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-medium">
                  {item.value !== null ? item.value : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Fund Commitments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Fund Name</TableHead>
                <TableHead className="text-xs">Commitment (USD M)</TableHead>
                <TableHead className="text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commitments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-xs">No fund commitments found</TableCell>
                </TableRow>
              ) : (
                commitments.map((commitment, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs">{commitment.fund_name}</TableCell>
                    <TableCell className="text-xs">
                      {commitment.commitment 
                        ? `${(commitment.commitment / 1e6).toFixed(0)}` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {commitment.commitment_date 
                        ? new Date(commitment.commitment_date).toLocaleDateString() 
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