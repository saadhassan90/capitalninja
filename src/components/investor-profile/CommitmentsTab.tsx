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
import { getAssetClassStyle } from "@/utils/assetClassColors";
import { formatCurrency } from "@/utils/formatters";
import { CommitmentsTabProps } from "@/types/investor-profile";
import { AssetClass } from "@/utils/assetClassColors";

export function CommitmentsTab({ commitments, investor }: CommitmentsTabProps) {
  const totalCommitments = commitments.reduce(
    (sum, commitment) => sum + (commitment.commitment || 0),
    0
  );

  const mapToAssetClass = (type: string): AssetClass => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('private equity')) return 'privateEquity';
    if (lowerType.includes('venture')) return 'venture';
    if (lowerType.includes('real estate')) return 'realEstate';
    if (lowerType.includes('debt')) return 'debtFunds';
    if (lowerType.includes('fund of funds') || lowerType.includes('secondaries')) return 'fundOfFunds';
    if (lowerType.includes('infrastructure')) return 'infrastructure';
    if (lowerType.includes('energy')) return 'energy';
    return 'other';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Fund Commitments</CardTitle>
          <CardDescription>
            View all fund commitments made by {investor.limited_partner_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Commitment (USD)</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commitments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No fund commitments found
                    </TableCell>
                  </TableRow>
                ) : (
                  commitments.map((commitment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {commitment.fund_name}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(commitment.commitment)}
                      </TableCell>
                      <TableCell>
                        {commitment.commitment_date
                          ? new Date(commitment.commitment_date).toLocaleDateString()
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Fund Type Distribution</CardTitle>
          <CardDescription>
            Distribution of commitments across different fund types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "Private Equity",
                count: investor.total_commitments_in_pefunds || 0,
              },
              {
                type: "Venture Capital",
                count: investor.total_commitments_in_vcfunds || 0,
              },
              {
                type: "Real Estate",
                count: investor.total_commitments_in_refunds || 0,
              },
              {
                type: "Debt",
                count: investor.total_commitments_in_debt_funds || 0,
              },
              {
                type: "Fund of Funds & Secondaries",
                count: investor.total_commitments_in_fofs_and2nd || 0,
              },
              {
                type: "Infrastructure",
                count: investor.total_commitments_in_infrastructure || 0,
              },
              {
                type: "Energy",
                count: investor.total_commitments_in_energy_funds || 0,
              },
              {
                type: "Other",
                count: investor.total_commitments_in_other_funds || 0,
              },
            ].map(({ type, count }) => {
              const style = getAssetClassStyle(mapToAssetClass(type));
              return count > 0 ? (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: style.backgroundColor }}
                    />
                    <span>{type}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}