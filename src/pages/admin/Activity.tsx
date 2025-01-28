import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity as ActivityIcon } from "lucide-react";
import { format } from "date-fns";

type ActivityWithProfile = {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
  user_id: string;
  profile: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export default function Activity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: async () => {
      // First get the activity logs
      const { data: activityData, error: activityError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (activityError) throw activityError;

      // Then get the profiles for each user_id
      const activitiesWithProfiles = await Promise.all(
        activityData.map(async (activity) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email, first_name, last_name')
            .eq('id', activity.user_id)
            .maybeSingle();

          return {
            ...activity,
            profile: profileData
          };
        })
      );

      return activitiesWithProfiles as ActivityWithProfile[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <ActivityIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                {activity.profile?.email || 'Unknown User'}
              </TableCell>
              <TableCell>{activity.action_type}</TableCell>
              <TableCell>{activity.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}