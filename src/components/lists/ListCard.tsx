import { memo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ListCardMenu } from "./ListCardMenu";
import { ListEditDialog } from "./ListEditDialog";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);

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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
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

  const handleCardClick = () => {
    navigate(`/lists/${list.id}`);
  };

  return (
    <>
      <Card 
        className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{list.name}</CardTitle>
            <div onClick={(e) => e.stopPropagation()}>
              <ListCardMenu
                listName={list.name}
                onEdit={() => setShowEditDialog(true)}
                onDelete={handleDelete}
              />
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
            <span>{formatDistanceToNow(new Date(list.created_at), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Records:</span>
            <span>{investorCount ?? '...'}</span>
          </div>
        </CardContent>
      </Card>

      <ListEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        list={list}
      />
    </>
  );
}

export const ListCard = memo(ListCardComponent);