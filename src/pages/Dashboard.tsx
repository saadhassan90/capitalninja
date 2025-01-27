import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { InvestorDistributionChart } from "@/components/dashboard/InvestorDistributionChart";
import { TransactionsChart } from "@/components/dashboard/TransactionsChart";
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
    <div className="flex-1 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your investor management dashboard</p>
      </div>

      <StatsCards listsCount={listsCount} investorsCount={investorsCount} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <InvestorDistributionChart data={investorTypes} />
        <TransactionsChart />
      </div>
    </div>
  );
};

export default Dashboard;