import { useParams } from "react-router-dom";
import { ListInvestorsTable } from "@/components/lists/ListInvestorsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, ClipboardList } from "lucide-react";

const ListView = () => {
  const { listId } = useParams();

  const { data: list } = useQuery({
    queryKey: ['list', listId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('id', listId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex-1 p-8 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{list?.name || 'List'}</h1>
            <p className="text-gray-500 mt-1">{list?.description}</p>
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