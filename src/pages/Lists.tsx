import { ListSection } from "@/components/lists/ListSection";
import { ListChecks, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  last_refreshed_at: string | null;
}

const Lists = () => {
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data as List[]) || [];
    }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <ListChecks className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage static and dynamic investor lists
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
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