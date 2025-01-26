import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { InvestorProfile } from "./InvestorProfile";

type LimitedPartner = {
  id: number;
  limited_partner_name: string;
  limited_partner_type: string | null;
  aum: number | null;
  hqlocation: string | null;
  preferred_fund_type: string | null;
  preferred_commitment_size_min: number | null;
};

async function fetchInvestors(searchTerm: string) {
  const query = supabase
    .from('limited_partners')
    .select('id, limited_partner_name, limited_partner_type, aum, hqlocation, preferred_fund_type, preferred_commitment_size_min')
    .order('limited_partner_name');

  if (searchTerm) {
    query.ilike('limited_partner_name', `%${searchTerm}%`);
  }

  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
}

export function InvestorsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);

  const { data: investors = [], isLoading, error } = useQuery({
    queryKey: ['investors', searchTerm],
    queryFn: () => fetchInvestors(searchTerm),
  });

  if (error) {
    return <div>Error loading investors</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <Input
          placeholder="Search investors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
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
                  <TableCell>{investor.preferred_fund_type || 'N/A'}</TableCell>
                  <TableCell>
                    {investor.preferred_commitment_size_min 
                      ? `${(investor.preferred_commitment_size_min / 1e6).toFixed(0)}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedInvestorId(investor.id)}
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

      {selectedInvestorId && (
        <InvestorProfile
          investorId={selectedInvestorId}
          open={selectedInvestorId !== null}
          onOpenChange={(open) => !open && setSelectedInvestorId(null)}
        />
      )}
    </div>
  );
}