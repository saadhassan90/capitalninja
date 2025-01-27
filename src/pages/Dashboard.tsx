import { StatsCards } from "@/components/dashboard/StatsCards";
import { AUMDistributionChart } from "@/components/dashboard/AUMDistributionChart";
import { InvestorDistributionChart } from "@/components/dashboard/InvestorDistributionChart";
import { TransactionsChart } from "@/components/dashboard/TransactionsChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { GeographicDistributionChart } from "@/components/dashboard/GeographicDistributionChart";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <StatsCards />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <InvestorDistributionChart />
        <AUMDistributionChart />
        <GeographicDistributionChart />
        <TransactionsChart />
        <ActivityTimeline />
      </div>
    </div>
  );
}