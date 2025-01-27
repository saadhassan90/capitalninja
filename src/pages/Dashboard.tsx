import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TransactionsChart } from "@/components/dashboard/TransactionsChart";
import { InvestorDistributionChart } from "@/components/dashboard/InvestorDistributionChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { LoadingState } from "@/components/ui/loading-state";

const Dashboard = () => {
  const { data: listsCount, isLoading: listsLoading } = useQuery({
    queryKey: ['lists-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('lists')
        .select('*', { count: 'exact', head: true });
      return count;
    },
  });

  const { data: investorsCount, isLoading: investorsLoading } = useQuery({
    queryKey: ['investors-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('limited_partners')
        .select('*', { count: 'exact', head: true });
      return count;
    },
  });

  const { data: investorTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['investor-types'],
    queryFn: async () => {
      const { data } = await supabase
        .from('limited_partners')
        .select('limited_partner_type');
      
      const types = data?.reduce((acc: Record<string, number>, curr) => {
        const type = curr.limited_partner_type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(types || {}).reduce((a, b) => a + b, 0);

      return Object.entries(types || {}).map(([name, value]) => ({
        name,
        value,
        total,
      }));
    },
  });

  const isLoading = listsLoading || investorsLoading || typesLoading;

  return (
    <LoadingState loading={isLoading}>
      <div className="p-8 space-y-8">
        <StatsCards
          listsCount={listsCount}
          investorsCount={investorsCount}
        />
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-4">
          <TransactionsChart />
          <ActivityTimeline />
        </div>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <InvestorDistributionChart data={investorTypes || []} />
        </div>
      </div>
    </LoadingState>
  );
};

export default Dashboard;