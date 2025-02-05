import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ListView = () => {
  const { id } = useParams();
  
  const { data: list } = useQuery({
    queryKey: ['list', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
      {list?.description && (
        <p className="text-muted-foreground mt-2">{list.description}</p>
      )}
    </div>
  );
};

export default ListView;