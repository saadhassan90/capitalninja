
import { useParams } from "react-router-dom";
import { ListInvestorsTable } from "@/components/lists/ListInvestorsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ListView = () => {
  const { id } = useParams();
  
  const { data: list, isLoading, error } = useQuery({
    queryKey: ['list', id],
    queryFn: async () => {
      if (!id) throw new Error("List ID is required");
      
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
  
  if (!id) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>List ID is required</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load list. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
      <p className="text-muted-foreground mb-8">{list.description}</p>
      <ListInvestorsTable listId={id} />
    </div>
  );
};

export default ListView;
