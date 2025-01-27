import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AUMDistributionChart } from "@/components/dashboard/AUMDistributionChart";
import { InvestorDistributionChart } from "@/components/dashboard/InvestorDistributionChart";
import { TransactionsChart } from "@/components/dashboard/TransactionsChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { GeographicDistributionChart } from "@/components/dashboard/GeographicDistributionChart";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get lists count
      const { count: listsCount } = await supabase
        .from('lists')
        .select('*', { count: 'exact', head: true });

      // Get investors count
      const { count: investorsCount } = await supabase
        .from('limited_partners')
        .select('*', { count: 'exact', head: true });

      return {
        listsCount,
        investorsCount
      };
    }
  });

  const { data: investorTypes } = useQuery({
    queryKey: ['investor-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('limited_partners')
        .select('limited_partner_type')
        .not('limited_partner_type', 'is', null);

      if (error) throw error;

      const typeCounts = data.reduce((acc, curr) => {
        const type = curr.limited_partner_type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = Object.values(typeCounts).reduce((a, b) => a + b, 0);

      return Object.entries(typeCounts).map(([name, value]) => ({
        name,
        value,
        total
      }));
    }
  });

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Account Activity Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">Account Activity</h3>
        <StatsCards 
          listsCount={stats?.listsCount ?? 0} 
          investorsCount={stats?.investorsCount ?? 0} 
        />
        <ActivityTimeline />
      </section>

      {/* Database Analytics Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">Database Analytics</h3>
        <div className="flex flex-col space-y-6">
          <div className="h-[500px] w-full">
            <GeographicDistributionChart />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="flex-1 h-[450px]">
              <InvestorDistributionChart data={investorTypes ?? []} />
            </div>
            <div className="flex-1 h-[450px]">
              <AUMDistributionChart />
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            <TransactionsChart />
          </div>
        </div>
      </section>
    </div>
  );
}