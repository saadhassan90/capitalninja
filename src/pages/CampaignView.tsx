import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Send, BarChart, List, Settings, Mail, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { useState } from "react";
import type { Campaign } from "@/types/campaign";
import type { SortConfig } from "@/types/sorting";
import { SequenceTab } from "@/components/campaigns/SequenceTab";

export default function CampaignView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'limited_partner_name',
    direction: 'asc'
  });

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          lists!list_id (
            name,
            id
          ),
          raise:raise_id (
            name,
            id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Campaign;
    },
  });

  const { data: investorsData, isLoading: investorsLoading } = useQuery({
    queryKey: ['list-investors', campaign?.list_id, currentPage, sortConfig],
    queryFn: async () => {
      if (!campaign?.list_id) return { data: [], count: 0 };

      const { data: listInvestors, error: listInvestorsError, count } = await supabase
        .from('list_investors')
        .select('investor_id', { count: 'exact' })
        .eq('list_id', campaign.list_id)
        .range((currentPage - 1) * 200, currentPage * 200 - 1);

      if (listInvestorsError) throw listInvestorsError;

      if (!listInvestors?.length) {
        return { data: [], count: 0 };
      }

      const investorIds = listInvestors.map(li => li.investor_id);

      const { data: investors, error: investorsError } = await supabase
        .from('limited_partners')
        .select('*')
        .in('id', investorIds)
        .order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });

      if (investorsError) throw investorsError;

      return { data: investors || [], count: count || 0 };
    },
    enabled: !!campaign?.list_id,
  });

  const handleSort = (column: string) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = (investorsData?.data || []).map(investor => investor.id);
      setSelectedInvestors(allIds);
    } else {
      setSelectedInvestors([]);
    }
  };

  const handleSelectInvestor = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedInvestors(prev => [...prev, id]);
    } else {
      setSelectedInvestors(prev => prev.filter(investorId => investorId !== id));
    }
  };

  if (campaignLoading) {
    return <div>Loading campaign details...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/campaigns')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-2">
              Status: <span className="font-medium text-foreground">{campaign.status}</span>
            </span>
            •
            <span className="flex items-center gap-2">
              List: <span className="font-medium text-foreground">{campaign.lists?.name || 'No list selected'}</span>
            </span>
            •
            <span className="flex items-center gap-2">
              Raise: <span className="font-medium text-foreground">{campaign.raise?.name || 'No raise selected'}</span>
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sequence">
            <Mail className="h-4 w-4 mr-2" />
            Sequence
          </TabsTrigger>
          <TabsTrigger value="leads">
            <List className="h-4 w-4 mr-2" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Status:</div>
              <div className="text-sm font-medium px-2 py-1 bg-secondary rounded-full">Draft</div>
              <Progress value={100} className="w-24 h-2" />
              <div className="text-sm text-muted-foreground">100%</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Sequence started</div>
                <div className="text-3xl font-semibold">-</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  Open rate <span className="text-xs">(0)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">0</span>
                  <span className="text-sm text-muted-foreground">| -</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  Click rate <span className="text-xs">(0)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">0</span>
                  <span className="text-sm text-muted-foreground">| -</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  Opportunities <span className="text-xs">(0)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">0</span>
                  <span className="text-sm text-muted-foreground">| $0</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-lg font-medium">No data available for specified time</div>
              <div className="text-sm text-muted-foreground">Step analytics will appear here once the campaign is published</div>
            </div>

            <div className="rounded-lg border">
              <div className="border-b px-4 py-4">
                <h3 className="font-semibold">Activity</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by email" 
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Step</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm">saad@investty.com</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {['Sent', 'Opened', 'Clicked', 'Responded'][index % 4]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">a month ago</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">Step {index + 1}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sequence" className="mt-6">
          <SequenceTab />
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <div className="rounded-lg border">
            <div className="border-b px-4 py-4">
              <h2 className="font-semibold">Campaign Leads</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {campaign.lists?.name ? 
                  `Showing investors from list: ${campaign.lists.name}` : 
                  'No list selected for this campaign'}
              </p>
            </div>
            <div className="p-4">
              {campaign.list_id ? (
                <InvestorsTableView 
                  investors={investorsData?.data ?? []}
                  isLoading={investorsLoading}
                  onViewInvestor={setSelectedInvestorId}
                  currentPage={currentPage}
                  totalPages={Math.ceil((investorsData?.count ?? 0) / 200)}
                  onPageChange={setCurrentPage}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  selectedInvestors={selectedInvestors}
                  onSelectAll={handleSelectAll}
                  onSelectInvestor={handleSelectInvestor}
                  listId={id}
                  campaign={campaign}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No list selected for this campaign. Edit the campaign to select a list of investors.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Settings</h2>
            <p className="text-muted-foreground">Campaign configuration options will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>

      <CampaignForm 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        campaign={campaign}
      />
    </div>
  );
}
