import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { ListSection } from "@/components/lists/ListSection";
import type { ListFilters } from "@/types/investorFilters";
import { useState } from "react";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  last_refreshed_at: string | null;
}

const Lists = () => {
  const [open, setOpen] = useState(false);

  const { data: lists } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data: lists, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return lists || [];
    },
  });

  const staticLists = lists?.filter(list => list.type === 'static') || [];
  const dynamicLists = lists?.filter(list => list.type === 'dynamic') || [];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-card-foreground">Lists</h1>
        <Button variant="default" className="bg-black hover:bg-black/80" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New List
        </Button>
      </div>

      <CreateListDialog
        open={open}
        onOpenChange={setOpen}
      />

      <ListSection title="Static Lists" lists={staticLists} />
      <ListSection title="Dynamic Lists" lists={dynamicLists} />
    </div>
  );
};

export default Lists;
