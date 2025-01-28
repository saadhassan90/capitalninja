import { ListSection } from "@/components/lists/ListSection";
import { ListCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Lists = () => {
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <ListCheck className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
      </div>
      
      <div className="space-y-8">
        <ListSection 
          title="Static Lists" 
          lists={lists?.filter(list => list.type === 'static') || []} 
        />
        <ListSection 
          title="Dynamic Lists" 
          lists={lists?.filter(list => list.type === 'dynamic') || []} 
        />
      </div>
    </div>
  );
};

export default Lists;