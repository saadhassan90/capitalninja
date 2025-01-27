import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export const ActivityTimeline = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Account Activity</CardTitle>
        <div className="text-sm text-muted-foreground">
          Recent actions and updates in your account
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
          <div className="flex gap-8 pb-6 px-2 min-w-max">
            {activities?.map((activity, index) => (
              <div key={activity.id} className="relative flex flex-col items-center">
                {/* Connector Line */}
                {index !== activities.length - 1 && (
                  <div className="absolute top-2 left-full w-8 h-[2px] bg-border" />
                )}
                
                {/* Timeline Node */}
                <div className="w-4 h-4 rounded-full bg-primary mb-2 relative z-10" />
                
                {/* Content */}
                <div className="flex flex-col items-center text-center w-48">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {activity.description}
                  </p>
                  <time className="text-xs text-gray-500">
                    {format(new Date(activity.created_at), "MMM d, h:mm a")}
                  </time>
                </div>
              </div>
            ))}
            {(!activities || activities.length === 0) && (
              <div className="flex items-center justify-center w-full">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};