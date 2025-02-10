
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
  // Query for total records exported
  const { data: exportsData } = useQuery({
    queryKey: ['exports-records'],
    queryFn: async () => {
      const { data } = await supabase
        .from('exports')
        .select('records')
        .not('records', 'is', null);
      
      // Sum up all records from exports
      return data?.reduce((sum, export_) => sum + (export_.records || 0), 0) || 0;
    },
  });

  // Query for monthly exports at team level
  const { data: monthlyExports } = useQuery({
    queryKey: ['monthly-exports'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // First get the user's team_id
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .single();

      if (!teamMember) return 0;

      // Then get the total records exported for the team this month
      const { data } = await supabase
        .from('exports')
        .select('records')
        .eq('team_id', teamMember.id)
        .gte('created_at', startOfMonth.toISOString())
        .not('records', 'is', null);

      // Sum up all records from exports
      return data?.reduce((sum, export_) => sum + (export_.records || 0), 0) || 0;
    },
  });

  // Query for team export limit
  const { data: teamExportLimit } = useQuery({
    queryKey: ['team-export-limit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_export_limits')
        .select('monthly_limit')
        .single();
      
      if (error) {
        console.error('Error fetching team export limit:', error);
        return 200; // Default to 200 if there's an error
      }
      
      return data?.monthly_limit ?? 200;
    },
  });

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
          <CardTitle className="text-sm font-medium">Total Records Exported</CardTitle>
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
          <CardTitle className="text-sm font-medium">Monthly Export Credits</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyExports ?? 0}/{teamExportLimit ?? 200}
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(), 'MMMM yyyy')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
