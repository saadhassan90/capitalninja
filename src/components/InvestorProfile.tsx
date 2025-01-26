import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

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
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Type:</span> {investor?.limited_partner_type || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">AUM:</span> {investor?.aum ? `$${(investor.aum / 1e9).toFixed(1)}B` : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Year Founded:</span> {investor?.year_founded || 'N/A'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Location:</span> {investor?.hqlocation || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {investor?.hqemail || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {investor?.hqphone || 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Investment Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Preferred Fund Type:</span> {investor?.preferred_fund_type || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Min Commitment:</span> {
                    investor?.preferred_commitment_size_min 
                      ? `$${(investor.preferred_commitment_size_min / 1e6).toFixed(0)}M` 
                      : 'N/A'
                  }
                </div>
                <div>
                  <span className="font-medium">Max Commitment:</span> {
                    investor?.preferred_commitment_size_max 
                      ? `$${(investor.preferred_commitment_size_max / 1e6).toFixed(0)}M` 
                      : 'N/A'
                  }
                </div>
                <div>
                  <span className="font-medium">Open to First-Time Funds:</span> {investor?.open_to_first_time_funds || 'N/A'}
                </div>
              </CardContent>
            </Card>

            {investor?.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {investor.description}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="commitments">
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
                    {fundCommitments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">No fund commitments found</TableCell>
                      </TableRow>
                    ) : (
                      fundCommitments.map((commitment) => (
                        <TableRow key={`${commitment.limited_partner_id}-${commitment.fund_id}`}>
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
          </TabsContent>
          
          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Direct Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Deal Size</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {directInvestments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">No direct investments found</TableCell>
                      </TableRow>
                    ) : (
                      directInvestments.map((investment) => (
                        <TableRow key={`${investment.limited_partner_id}-${investment.company_name}`}>
                          <TableCell>{investment.company_name}</TableCell>
                          <TableCell>
                            {investment.deal_size 
                              ? `$${(investment.deal_size / 1e6).toFixed(0)}M` 
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}