import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { ListSection } from "@/components/lists/ListSection";
import type { ListFilters } from "@/types/investorFilters";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  filters: ListFilters | null;
  last_refreshed_at: string;
}

const Lists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [open, setOpen] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setLists(data as List[]);
      return data;
    },
  });

  const handleCreateList = async (newList: {
    name: string;
    description: string;
    type: "static" | "dynamic";
    filters?: ListFilters;
  }) => {
    const filtersJson = newList.type === "dynamic" 
      ? {
          type: newList.filters?.type,
          location: newList.filters?.location,
          assetClass: newList.filters?.assetClass,
          firstTimeFunds: newList.filters?.firstTimeFunds,
          aumRange: newList.filters?.aumRange,
        }
      : null;

    const { data, error } = await supabase
      .from("lists")
      .insert({
        name: newList.name,
        description: newList.description,
        type: newList.type,
        filters: filtersJson,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating list:", error);
      return;
    }

    setLists([data as List, ...lists]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const staticLists = lists.filter(list => list.type === 'static');
  const dynamicLists = lists.filter(list => list.type === 'dynamic');

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
        onCreateList={handleCreateList}
      />

      <ListSection title="Static Lists" lists={staticLists} />
      <ListSection title="Dynamic Lists" lists={dynamicLists} />
    </div>
  );
};

export default Lists;