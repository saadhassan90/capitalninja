import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { InvestorProfile } from "./InvestorProfile";
import { InvestorsSearch } from "./investors/InvestorsSearch";
import { InvestorsTableView } from "./investors/InvestorsTableView";

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
      <InvestorsSearch 
        value={searchTerm}
        onChange={setSearchTerm}
      />
      
      <InvestorsTableView 
        investors={investors}
        isLoading={isLoading}
        onViewInvestor={setSelectedInvestorId}
      />

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