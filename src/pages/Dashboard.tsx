import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ListTodo, Database } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9A77CF', '#A8A8A8'];

const INVESTOR_CATEGORIES = {
  'SFO': 'Single Family Offices',
  'MFO': 'Multi Family Offices',
  'Pension': 'Pensions',
  'Insurance': 'Insurance Companies',
  'Endowment': 'Endowments',
  'Foundation': 'Foundations',
  'Wealth Manager': 'Wealth Managers',
  'Other': 'Other'
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Count: {payload[0].value}
          <br />
          Percentage: {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

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
      
      // Initialize counters for each category
      const typeCounts: Record<string, number> = Object.keys(INVESTOR_CATEGORIES).reduce((acc, key) => {
        acc[INVESTOR_CATEGORIES[key as keyof typeof INVESTOR_CATEGORIES]] = 0;
        return acc;
      }, {} as Record<string, number>);

      // Count investors by type
      data?.forEach(investor => {
        let type = investor.limited_partner_type || 'Unknown';
        let category = 'Other';

        // Map the type to our categories
        if (type.includes('SFO') || type.includes('Single Family')) category = 'Single Family Offices';
        else if (type.includes('MFO') || type.includes('Multi Family')) category = 'Multi Family Offices';
        else if (type.includes('Pension')) category = 'Pensions';
        else if (type.includes('Insurance')) category = 'Insurance Companies';
        else if (type.includes('Endowment')) category = 'Endowments';
        else if (type.includes('Foundation')) category = 'Foundations';
        else if (type.includes('Wealth')) category = 'Wealth Managers';

        typeCounts[category]++;
      });

      const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);
      
      return Object.entries(typeCounts)
        .filter(([_, value]) => value > 0) // Only include categories with values
        .map(([name, value]) => ({
          name,
          value,
          total,
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
            <div className="flex items-center justify-center h-full">
              <div className="w-[70%] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={investorTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {investorTypes?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      wrapperStyle={{
                        paddingLeft: "40px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;