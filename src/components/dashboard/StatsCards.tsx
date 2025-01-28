import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, Database, FileSpreadsheet, Sparkles, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface StatsCardsProps {
  listsCount: number | null;
  investorsCount: number | null;
}

export const StatsCards = ({ listsCount, investorsCount }: StatsCardsProps) => {
  // Query for exports count
  const { data: exportsData } = useQuery({
    queryKey: ['exports-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('exports')
        .select('*', { count: 'exact', head: true });
      return count;
    },
  });

  // Query for monthly exports
  const { data: monthlyExports } = useQuery({
    queryKey: ['monthly-exports'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('exports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      return count;
    },
  });

  // Monthly limit is hardcoded for now - this could be moved to a subscription/plan table later
  const monthlyLimit = 1000;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{listsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{investorsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{exportsData ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            Since {format(new Date(), 'MMMM yyyy')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leads Enriched</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{exportsData ? exportsData * 100 : 0}</div>
          <p className="text-xs text-muted-foreground">
            Total records processed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Credits</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyExports ?? 0}/{monthlyLimit}
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(), 'MMMM yyyy')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};