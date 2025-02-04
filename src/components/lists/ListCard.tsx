import { memo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface ListCardProps {
  list: List;
  onDelete?: () => void;
}

function ListCardComponent({ list, onDelete }: ListCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: investorCount } = useQuery({
    queryKey: ['listInvestorsCount', list.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('list_investors')
        .select('*', { count: 'exact', head: true })
        .eq('list_id', list.id);
      
      if (error) throw error;
      return count || 0;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', list.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "List deleted successfully",
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete list",
        variant: "destructive",
      });
    }
  };

  const handleView = () => {
    navigate(`/lists/${list.id}`);
  };

  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={handleView}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{list.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Clone</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the list "{list.name}" and remove all associated data.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete List
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <span>{formatDistanceToNow(new Date(list.created_at), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Records:</span>
          <span>{investorCount ?? '...'}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export const ListCard = memo(ListCardComponent);