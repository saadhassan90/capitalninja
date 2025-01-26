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

type InvestorProfileProps = {
  investorId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

async function fetchInvestorDetails(investorId: number) {
  const { data, error } = await supabase
    .from('limited_partners')
    .select('*')
    .eq('id', investorId)
    .single();
  
  if (error) throw error;
  return data;
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
          <DialogTitle className="text-2xl">{investor?.limited_partner_name}</DialogTitle>
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
            <CommitmentsTab commitments={fundCommitments} />
          </TabsContent>
          
          <TabsContent value="investments">
            <InvestmentsTab investments={directInvestments} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}