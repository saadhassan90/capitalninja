import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, ClipboardList, Loader2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/AuthProvider";
import { ListInvestorsTable } from "@/components/lists/ListInvestorsTable";

const ListView = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: list, isLoading, error } = useQuery({
    queryKey: ['list', listId],
    queryFn: async () => {
      if (!listId || !user) throw new Error('List ID and authentication required');
      
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', listId)
        .eq('created_by', user.id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('List not found');

      return data;
    },
    enabled: !!listId && !!user,
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load list'}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => navigate('/lists')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lists
        </Button>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <Alert>
          <AlertDescription>List not found</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => navigate('/lists')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lists
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{list.name}</h1>
            {list.description && (
              <p className="text-muted-foreground mt-1">{list.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {list.type === 'dynamic' && (
            <p className="text-sm text-muted-foreground">
              Last refreshed: {list.last_refreshed_at ? new Date(list.last_refreshed_at).toLocaleString() : 'Never'}
            </p>
          )}
          <Button variant="default" className="bg-black hover:bg-black/80">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {listId && <ListInvestorsTable listId={listId} />}
      </div>
    </div>
  );
};

export default ListView;