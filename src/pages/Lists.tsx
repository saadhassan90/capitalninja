import { ListSection } from "@/components/lists/ListSection";
import { LoadingState } from "@/components/ui/loading-state";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Lists = () => {
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lists')
        .select('*');
      return data;
    },
  });

  return (
    <div className="p-8">
      <LoadingState loading={isLoading}>
        <ListSection lists={lists || []} />
      </LoadingState>
    </div>
  );
};

export default Lists;