import { useParams } from "react-router-dom";
import { ListInvestorsTable } from "@/components/lists/ListInvestorsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, ClipboardList, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ListView = () => {
  const { listId } = useParams();

  const { data: list, isLoading, error } = useQuery({
    queryKey: ['list', listId],
    queryFn: async () => {
      if (!listId) throw new Error('List ID is required');
      
      console.log('Fetching list with ID:', listId);
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', listId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching list:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('List not found');
      }

      console.log('Fetched list:', data);
      return data;
    },
    enabled: !!listId,
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
      <div className="flex-1 p-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load list'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex-1 p-8">
        <Alert>
          <AlertDescription>List not found</AlertDescription>
        </Alert>
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
            <p className="text-gray-500 mt-1">{list.description}</p>
          </div>
        </div>
        <Button variant="default" className="bg-black hover:bg-black/80">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {listId && <ListInvestorsTable listId={listId} />}
      </div>
    </div>
  );
};

export default ListView;