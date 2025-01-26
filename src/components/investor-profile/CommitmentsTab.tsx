import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FundCommitment = {
  fund_name: string;
  commitment: number | null;
  commitment_date: string | null;
};

export function CommitmentsTab({ commitments }: { commitments: FundCommitment[] }) {
  return (
    <div className="h-[600px] overflow-y-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Fund Commitments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Name</TableHead>
                <TableHead>Commitment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commitments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No fund commitments found</TableCell>
                </TableRow>
              ) : (
                commitments.map((commitment, index) => (
                  <TableRow key={index}>
                    <TableCell>{commitment.fund_name}</TableCell>
                    <TableCell>
                      {commitment.commitment 
                        ? `$${(commitment.commitment / 1e6).toFixed(0)}M` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
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