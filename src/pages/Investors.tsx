import { InvestorsTableView } from "@/components/investors/InvestorsTableView";
import { LoadingState } from "@/components/ui/loading-state";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Investors = () => {
  const { data: investors, isLoading } = useQuery({
    queryKey: ['investors'],
    queryFn: async () => {
      const { data } = await supabase
        .from('limited_partners')
        .select('*');
      return data;
    },
  });

  return (
    <div className="p-8">
      <LoadingState loading={isLoading}>
        <InvestorsTableView investors={investors || []} />
      </LoadingState>
    </div>
  );
};

export default Investors;