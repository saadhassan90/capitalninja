import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  last_refreshed_at: string | null;
}

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  const { data: investorCount } = useQuery({
    queryKey: ['listInvestorsCount', list.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('list_investors')
        .select('*', { count: 'exact', head: true })
        .eq('list_id', list.id);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const getLastUpdatedText = () => {
    const date = list.type === 'dynamic' && list.last_refreshed_at 
      ? new Date(list.last_refreshed_at)
      : new Date(list.created_at);
    
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{list.name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-md ${
              list.type === "static"
                ? "bg-gray-100 text-gray-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {list.type}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Clone</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {list.description && (
          <CardDescription className="text-muted-foreground mt-2">
            {list.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last updated:</span>
          <span>{getLastUpdatedText()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Records:</span>
          <span>{investorCount ?? '...'}</span>
        </div>
      </CardContent>
    </Card>
  );
}