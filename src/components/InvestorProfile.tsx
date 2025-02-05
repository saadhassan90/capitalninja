import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./investor-profile/OverviewTab";
import { CommitmentsTab } from "./investor-profile/CommitmentsTab";
import { InvestmentsTab } from "./investor-profile/InvestmentsTab";
import { InvestorData } from "@/types/investor";
import { ProcessedInvestorData } from "@/types/processedInvestor";

type InvestorProfileProps = {
  investorId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

async function fetchInvestorDetails(investorId: number): Promise<ProcessedInvestorData> {
  const { data, error } = await supabase
    .from('limited_partners')
    .select('*')
    .eq('id', investorId)
    .single();
  
  if (error) throw error;

  const rawData = data as unknown as InvestorData;

  // Convert bigint values to numbers for the UI
  const processedData: ProcessedInvestorData = {
    ...rawData,
    id: Number(rawData.id),
    aum: rawData.aum ? Number(rawData.aum) : null,
    total_commitments_in_debt_funds: rawData.total_commitments_in_debt_funds ? Number(rawData.total_commitments_in_debt_funds) : null,
    total_commitments_in_pefunds: rawData.total_commitments_in_pefunds ? Number(rawData.total_commitments_in_pefunds) : null,
    total_commitments_in_refunds: rawData.total_commitments_in_refunds ? Number(rawData.total_commitments_in_refunds) : null,
    total_commitments_in_vcfunds: rawData.total_commitments_in_vcfunds ? Number(rawData.total_commitments_in_vcfunds) : null,
    total_commitments_in_fofs_and2nd: rawData.total_commitments_in_fofs_and2nd ? Number(rawData.total_commitments_in_fofs_and2nd) : null,
    total_commitments_in_infrastructure: rawData.total_commitments_in_infrastructure ? Number(rawData.total_commitments_in_infrastructure) : null,
    total_commitments_in_energy_funds: rawData.total_commitments_in_energy_funds ? Number(rawData.total_commitments_in_energy_funds) : null,
    total_commitments_in_other_funds: rawData.total_commitments_in_other_funds ? Number(rawData.total_commitments_in_other_funds) : null,
    direct_investments: rawData.direct_investments ? Number(rawData.direct_investments) : null,
    allocation_to_alternative_investments: rawData.allocation_to_alternative_investments ? Number(rawData.allocation_to_alternative_investments) : null,
    private_equity: rawData.private_equity ? Number(rawData.private_equity) : null,
    real_estate: rawData.real_estate ? Number(rawData.real_estate) : null,
    special_opportunities: rawData.special_opportunities ? Number(rawData.special_opportunities) : null,
    hedge_funds: rawData.hedge_funds ? Number(rawData.hedge_funds) : null,
    equities: rawData.equities ? Number(rawData.equities) : null,
    fixed_income: rawData.fixed_income ? Number(rawData.fixed_income) : null,
    cash: rawData.cash ? Number(rawData.cash) : null,
    preferred_commitment_size_min: rawData.preferred_commitment_size_min ? Number(rawData.preferred_commitment_size_min) : null,
    preferred_commitment_size_max: rawData.preferred_commitment_size_max ? Number(rawData.preferred_commitment_size_max) : null,
    preferred_direct_investment_size_min: rawData.preferred_direct_investment_size_min ? Number(rawData.preferred_direct_investment_size_min) : null,
    preferred_direct_investment_size_max: rawData.preferred_direct_investment_size_max ? Number(rawData.preferred_direct_investment_size_max) : null,
  };

  return processedData;
}

async function fetchFundCommitments(investorId: number) {
  const { data, error } = await supabase
    .from('fund_commitments')
    .select('*')
    .eq('limited_partner_id', investorId);
  
  if (error) throw error;
  return data;
}

async function fetchDirectInvestments(investorId: number) {
  const { data, error } = await supabase
    .from('direct_investments')
    .select('*')
    .eq('limited_partner_id', investorId);
  
  if (error) throw error;
  return data;
}

export function InvestorProfile({ investorId, open, onOpenChange }: InvestorProfileProps) {
  const { data: investor, isLoading: isLoadingInvestor } = useQuery({
    queryKey: ['investor', investorId],
    queryFn: () => fetchInvestorDetails(investorId),
  });

  const { data: fundCommitments = [] } = useQuery({
    queryKey: ['fundCommitments', investorId],
    queryFn: () => fetchFundCommitments(investorId),
  });

  const { data: directInvestments = [] } = useQuery({
    queryKey: ['directInvestments', investorId],
    queryFn: () => fetchDirectInvestments(investorId),
  });

  if (isLoadingInvestor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A1F2C]">
            {investor?.limited_partner_name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="commitments">Fund Commitments</TabsTrigger>
            <TabsTrigger value="investments">Direct Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab investor={investor} />
          </TabsContent>
          
          <TabsContent value="commitments">
            <CommitmentsTab commitments={fundCommitments} investor={investor} />
          </TabsContent>
          
          <TabsContent value="investments">
            <InvestmentsTab investments={directInvestments} investor={investor} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}