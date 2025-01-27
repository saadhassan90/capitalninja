import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ListTodo, Database } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

// Updated monochromatic purple color palette
const COLORS = [
  '#9b87f5', // Primary Purple
  '#7E69AB', // Secondary Purple
  '#6E59A5', // Tertiary Purple
  '#1A1F2C', // Dark Purple
  '#D6BCFA', // Light Purple
  '#E5DEFF', // Soft Purple
  '#8B5CF6', // Vivid Purple
  '#6E59A5'  // Additional Tertiary Purple
];

const INVESTOR_CATEGORIES = {
  'Single Family Offices': ['Single Family Office', 'SFO', 'Single-Family Office'],
  'Multi Family Offices': ['Multi Family Office', 'MFO', 'Multi-Family Office'],
  'Pensions': ['Pension', 'Pension Fund', 'Public Pension'],
  'Insurance Companies': ['Insurance', 'Insurance Company'],
  'Endowments': ['Endowment'],
  'Foundations': ['Foundation'],
  'Wealth Managers': ['Wealth Manager', 'Wealth Management'],
  'Other': []
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
        const type = investor.limited_partner_type || '';
        let matched = false;

        if (type.toLowerCase().includes('family office')) {
          if (type.toLowerCase().includes('single') || 
              type.toLowerCase().includes('sfo')) {
            typeCounts['Single Family Offices']++;
            matched = true;
          } else if (type.toLowerCase().includes('multi') || 
                    type.toLowerCase().includes('mfo')) {
            typeCounts['Multi Family Offices']++;
            matched = true;
          } else {
            typeCounts['Single Family Offices']++;
            matched = true;
          }
        }

        if (!matched) {
          for (const [category, keywords] of Object.entries(INVESTOR_CATEGORIES)) {
            if (category === 'Other' || category.includes('Family Office')) continue;
            
            if (keywords.some(keyword => 
              type.toLowerCase().includes(keyword.toLowerCase())
            )) {
              typeCounts[category]++;
              matched = true;
              break;
            }
          }

          if (!matched) {
            typeCounts['Other']++;
          }
        }
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
                      cornerRadius={8}
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
                        color: "#000000",
                        fontSize: "12px",
                        fontWeight: "500"
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