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
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action_type,
          description,
          created_at,
          user_id,
          profile:profiles!activity_logs_user_id_fkey (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as ActivityWithProfile[];
    }
  });

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
                {activity.profile?.email}
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