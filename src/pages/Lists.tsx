import { ListSection } from "@/components/lists/ListSection";
import { LoadingState } from "@/components/ui/loading-state";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ListType = "static" | "dynamic";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: ListType;
  last_refreshed_at: string | null;
}

const Lists = () => {
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lists')
        .select('*');
      
      // Ensure the type is correctly cast as ListType
      return (data || []).map(list => ({
        ...list,
        type: list.type as ListType
      })) as List[];
    },
  });

  return (
    <div className="p-8">
      <LoadingState loading={isLoading}>
        <ListSection 
          title="Lists"
          lists={lists || []} 
        />
      </LoadingState>
    </div>
  );
};

export default Lists;