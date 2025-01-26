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

type DirectInvestment = {
  company_name: string;
  deal_size: number | null;
  deal_date: string | null;
};

type InvestmentsTabProps = {
  investments: DirectInvestment[];
  investor: Tables<"limited_partners">;
};

export function InvestmentsTab({ investments, investor }: InvestmentsTabProps) {
  const investmentPreferences = [
    {
      label: "Total Direct Investments",
      value: investor.direct_investments,
    },
    {
      label: "Min Direct Investment Size (USD M)",
      value: investor.preferred_direct_investment_size_min ? 
        `${(investor.preferred_direct_investment_size_min / 1e6).toFixed(0)}` : 
        'N/A'
    },
    {
      label: "Max Direct Investment Size (USD M)",
      value: investor.preferred_direct_investment_size_max ? 
        `${(investor.preferred_direct_investment_size_max / 1e6).toFixed(0)}` : 
        'N/A'
    },
    {
      label: "Preferred Geography",
      value: investor.preferred_geography || 'N/A'
    }
  ];

  return (
    <div className="h-[600px] overflow-y-auto space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Investment Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {investmentPreferences.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-medium">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Direct Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Deal Size (USD M)</TableHead>
                <TableHead className="text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-xs">No direct investments found</TableCell>
                </TableRow>
              ) : (
                investments.map((investment, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs">{investment.company_name}</TableCell>
                    <TableCell className="text-xs">
                      {investment.deal_size 
                        ? `${(investment.deal_size / 1e6).toFixed(0)}` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs">
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