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

type InvestorProfileProps = {
  investorId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

async function fetchInvestorDetails(investorId: number): Promise<InvestorData> {
  const { data, error } = await supabase
    .from('limited_partners')
    .select('*')
    .eq('id', investorId)
    .single();
  
  if (error) throw error;

  // Keep bigint values as they are, only convert non-bigint numeric fields
  const processedData: InvestorData = {
    ...data,
    id: Number(data.id),
    year_founded: data.year_founded ? Number(data.year_founded) : null,
    number_of_affiliated_funds: data.number_of_affiliated_funds ? Number(data.number_of_affiliated_funds) : null,
    number_of_affiliated_investors: data.number_of_affiliated_investors ? Number(data.number_of_affiliated_investors) : null,
    allocation_to_alternative_investments_percent: data.allocation_to_alternative_investments_percent ? Number(data.allocation_to_alternative_investments_percent) : null,
    private_equity_percent: data.private_equity_percent ? Number(data.private_equity_percent) : null,
    real_estate_percent: data.real_estate_percent ? Number(data.real_estate_percent) : null,
    special_opportunities_percent: data.special_opportunities_percent ? Number(data.special_opportunities_percent) : null,
    hedge_funds_percent: data.hedge_funds_percent ? Number(data.hedge_funds_percent) : null,
    equities_percent: data.equities_percent ? Number(data.equities_percent) : null,
    fixed_income_percent: data.fixed_income_percent ? Number(data.fixed_income_percent) : null,
    cash_percent: data.cash_percent ? Number(data.cash_percent) : null,
    target_alternatives_min: data.target_alternatives_min ? Number(data.target_alternatives_min) : null,
    target_alternatives_max: data.target_alternatives_max ? Number(data.target_alternatives_max) : null,
    target_private_equity_min: data.target_private_equity_min ? Number(data.target_private_equity_min) : null,
    target_private_equity_max: data.target_private_equity_max ? Number(data.target_private_equity_max) : null,
    target_real_estate_min: data.target_real_estate_min ? Number(data.target_real_estate_min) : null,
    target_real_estate_max: data.target_real_estate_max ? Number(data.target_real_estate_max) : null,
    target_special_opportunities_min: data.target_special_opportunities_min ? Number(data.target_special_opportunities_min) : null,
    target_special_opportunities_max: data.target_special_opportunities_max ? Number(data.target_special_opportunities_max) : null,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">{investor?.limited_partner_name}</DialogTitle>
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
