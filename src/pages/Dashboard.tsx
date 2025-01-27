import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { InvestorDistributionChart } from "@/components/dashboard/InvestorDistributionChart";
import { TransactionsChart } from "@/components/dashboard/TransactionsChart";
import { InvestmentHeatmap } from "@/components/dashboard/InvestmentHeatmap";
import { InvestmentNetworkGraph } from "@/components/dashboard/InvestmentNetworkGraph";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { INVESTOR_CATEGORIES, categorizeInvestorType } from "@/utils/investorCategories";

const Dashboard = () => {
  const { data: listsCount } = useQuery({
    queryKey: ['listsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('lists')
        .select('*', { count: 'exact' });
      return count || 0;
    },
  });

  const { data: investorTypes } = useQuery({
    queryKey: ['investorTypes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('limited_partners')
        .select('limited_partner_type');
      
      const typeCounts: Record<string, number> = Object.keys(INVESTOR_CATEGORIES).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {} as Record<string, number>);

      data?.forEach(investor => {
        const category = categorizeInvestorType(investor.limited_partner_type);
        typeCounts[category]++;
      });

      const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);
      
      return Object.entries(typeCounts)
        .map(([name, value]) => ({
          name,
          value,
          total,
        }))
        .filter(entry => entry.value > 0)
        .sort((a, b) => b.value - a.value);
    },
  });

  const { data: investorsCount } = useQuery({
    queryKey: ['investorsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('limited_partners')
        .select('*', { count: 'exact' });
      return count || 0;
    },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Account Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Account Overview</h2>
          <p className="text-sm text-muted-foreground">
            Monitor your account activity and key metrics
          </p>
        </div>
        <div className="space-y-4">
          <StatsCards listsCount={listsCount} investorsCount={investorsCount} />
          <ActivityTimeline />
        </div>
      </section>

      {/* Database Metrics Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Database Metrics</h2>
          <p className="text-sm text-muted-foreground">
            Analyze investor distribution and investment trends
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <InvestorDistributionChart data={investorTypes} />
          <TransactionsChart />
          <InvestmentHeatmap />
        </div>
      </section>

      {/* Network Analysis Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Network Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Visualize investment relationships and patterns
          </p>
        </div>
        <div className="grid gap-6">
          <InvestmentNetworkGraph />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;