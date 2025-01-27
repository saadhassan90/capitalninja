import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ListTodo, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  // Fetch lists count
  const { data: listsCount } = useQuery({
    queryKey: ['listsCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('lists')
        .select('*', { count: 'exact' });
      return count || 0;
    },
  });

  // Fetch investor types distribution
  const { data: investorTypes } = useQuery({
    queryKey: ['investorTypes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('limited_partners')
        .select('limited_partner_type');
      
      const typeCounts = data?.reduce((acc: Record<string, number>, curr) => {
        const type = curr.limited_partner_type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(typeCounts || {}).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  // Fetch total investors count
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

      {/* Section 1: Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Analytics */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Investor Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investorTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;