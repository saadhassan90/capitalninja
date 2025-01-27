import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ListTodo, Database, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { format, eachDayOfInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface InvestorType {
  name: string;
  value: number;
}

interface DayActivity {
  date: Date;
  value: number;
  deals: number;
  intensity: number;
}

interface MonthData {
  month: string;
  year: string;
  days: DayActivity[];
  totalValue: number;
  totalDeals: number;
}

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

  // Fetch investor types distribution
  const { data: investorTypes } = useQuery<InvestorType[]>({
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

  // Fetch asset class activity data with dates
  const { data: assetClassActivity } = useQuery<MonthData[]>({
    queryKey: ['assetClassActivity'],
    queryFn: async () => {
      const startDate = subMonths(new Date(), 18); // Show last 18 months
      const endDate = new Date();

      // Get fund commitments data
      const { data: commitments } = await supabase
        .from('fund_commitments')
        .select(`
          commitment,
          commitment_date,
          limited_partners (
            preferred_fund_type
          )
        `)
        .gte('commitment_date', startDate.toISOString())
        .lte('commitment_date', endDate.toISOString())
        .not('commitment', 'is', null);

      // Get direct investments data
      const { data: investments } = await supabase
        .from('direct_investments')
        .select(`
          deal_size,
          deal_date,
          limited_partners (
            preferred_fund_type
          )
        `)
        .gte('deal_date', startDate.toISOString())
        .lte('deal_date', endDate.toISOString())
        .not('deal_size', 'is', null);

      // Generate all dates in range
      const dates = eachDayOfInterval({ start: startDate, end: endDate });
      const activityByDate = new Map<string, DayActivity>();

      // Initialize all dates with 0
      dates.forEach(date => {
        activityByDate.set(format(date, 'yyyy-MM-dd'), {
          date,
          value: 0,
          deals: 0,
          intensity: 0
        });
      });

      // Process fund commitments
      commitments?.forEach((item) => {
        if (item.commitment_date) {
          const dateKey = format(new Date(item.commitment_date), 'yyyy-MM-dd');
          const current = activityByDate.get(dateKey) || { 
            date: new Date(item.commitment_date), 
            value: 0, 
            deals: 0,
            intensity: 0
          };
          current.value += Number(item.commitment) || 0;
          current.deals += 1;
          activityByDate.set(dateKey, current);
        }
      });

      // Process direct investments
      investments?.forEach((item) => {
        if (item.deal_date) {
          const dateKey = format(new Date(item.deal_date), 'yyyy-MM-dd');
          const current = activityByDate.get(dateKey) || { 
            date: new Date(item.deal_date), 
            value: 0, 
            deals: 0,
            intensity: 0
          };
          current.value += Number(item.deal_size) || 0;
          current.deals += 1;
          activityByDate.set(dateKey, current);
        }
      });

      // Group by month for the calendar view
      const monthlyData = Array.from(activityByDate.values()).reduce((acc: Record<string, MonthData>, curr) => {
        const monthKey = format(curr.date, 'yyyy-MM');
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: format(curr.date, 'MMM'),
            year: format(curr.date, 'yyyy'),
            days: [],
            totalValue: 0,
            totalDeals: 0
          };
        }
        acc[monthKey].days.push({
          ...curr,
          intensity: curr.value > 0 ? Math.min(Math.log10(curr.value / 1e6) + 1, 4) : 0
        });
        acc[monthKey].totalValue += curr.value;
        acc[monthKey].totalDeals += curr.deals;
        return acc;
      }, {});

      return Object.values(monthlyData);
    },
  });

  return (
    <div className="flex-1 p-8 space-y-8">
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

        {/* Calendar Heatmap */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Investment Activity Heatmap</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {assetClassActivity?.map((monthData) => (
                  <div key={`${monthData.year}-${monthData.month}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {monthData.month} {monthData.year}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {monthData.totalDeals} deals
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-xs text-center text-muted-foreground">
                          {day}
                        </div>
                      ))}
                      {monthData.days.map((day, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-sm"
                          style={{
                            backgroundColor: day.intensity === 0 
                              ? 'rgb(229, 231, 235)' 
                              : `rgba(124, 58, 237, ${day.intensity * 0.25})`,
                          }}
                          title={`${format(day.date, 'PP')}: ${day.deals} deals, $${(day.value / 1e6).toFixed(1)}M`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center gap-2">
                <span className="text-sm text-muted-foreground">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: level === 0 
                        ? 'rgb(229, 231, 235)' 
                        : `rgba(124, 58, 237, ${level * 0.25})`,
                    }}
                  />
                ))}
                <span className="text-sm text-muted-foreground">More</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
