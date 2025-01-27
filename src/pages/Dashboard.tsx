import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ListTodo, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { assetClassColors } from "@/utils/assetClassColors";

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

  // Fetch asset class activity data
  const { data: assetClassActivity } = useQuery({
    queryKey: ['assetClassActivity'],
    queryFn: async () => {
      // Get fund commitments data
      const { data: commitments } = await supabase
        .from('fund_commitments')
        .select(`
          commitment,
          limited_partners (
            preferred_fund_type
          )
        `)
        .not('commitment', 'is', null);

      // Get direct investments data
      const { data: investments } = await supabase
        .from('direct_investments')
        .select(`
          deal_size,
          limited_partners (
            preferred_fund_type
          )
        `)
        .not('deal_size', 'is', null);

      // Process the data for the heatmap
      const activityMap = new Map();

      // Process fund commitments
      commitments?.forEach((item) => {
        if (item.limited_partners?.preferred_fund_type) {
          const types = item.limited_partners.preferred_fund_type.split(',').map(t => t.trim());
          types.forEach(type => {
            const current = activityMap.get(type) || { commitments: 0, investments: 0, total: 0 };
            current.commitments += Number(item.commitment) || 0;
            current.total = current.commitments + current.investments;
            activityMap.set(type, current);
          });
        }
      });

      // Process direct investments
      investments?.forEach((item) => {
        if (item.limited_partners?.preferred_fund_type) {
          const types = item.limited_partners.preferred_fund_type.split(',').map(t => t.trim());
          types.forEach(type => {
            const current = activityMap.get(type) || { commitments: 0, investments: 0, total: 0 };
            current.investments += Number(item.deal_size) || 0;
            current.total = current.commitments + current.investments;
            activityMap.set(type, current);
          });
        }
      });

      // Convert to array and sort by total activity
      return Array.from(activityMap.entries())
        .map(([name, data]) => ({
          name,
          value: data.total / 1e6, // Convert to millions
          intensity: Math.log(data.total / 1e6) // Logarithmic scale for better visualization
        }))
        .sort((a, b) => b.value - a.value);
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

        {/* New Section: Asset Class Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Class Activity Heatmap (USD M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {assetClassActivity?.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: `rgba(24, 119, 242, ${Math.min(item.intensity / 10, 0.9)})`,
                    color: item.intensity > 5 ? 'white' : 'black',
                  }}
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-lg font-bold">
                    {item.value.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}M
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
