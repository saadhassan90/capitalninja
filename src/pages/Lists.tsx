import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { ListSection } from "@/components/lists/ListSection";
import type { ListFilters } from "@/types/investorFilters";
import { useState } from "react";
import { toast } from "sonner";

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

  const { data: lists, refetch } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data: lists, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (lists || []).map(list => ({
        ...list,
        type: list.type === 'dynamic' ? 'dynamic' : 'static'
      })) as List[];
    },
  });

  const handleCreateList = async (list: {
    name: string;
    description: string;
    type: "static" | "dynamic";
    created_by: string;
    filters?: ListFilters;
  }) => {
    try {
      // Create a clean filters object without null or empty values
      const cleanFilters = list.type === 'dynamic' && list.filters ? {
        type: list.filters.type === '_all' ? null : list.filters.type,
        location: list.filters.location === '_all' ? null : list.filters.location,
        assetClass: list.filters.assetClass === '_all' ? null : list.filters.assetClass,
        firstTimeFunds: list.filters.firstTimeFunds === '_all' ? null : list.filters.firstTimeFunds,
        aumRange: list.filters.aumRange && list.filters.aumRange.length === 2 ? list.filters.aumRange : null
      } : null;

      // Remove any null or undefined values from cleanFilters
      const finalFilters = cleanFilters ? Object.fromEntries(
        Object.entries(cleanFilters).filter(([_, value]) => value !== null && value !== undefined)
      ) : null;

      const { error } = await supabase
        .from('lists')
        .insert([{
          name: list.name,
          description: list.description,
          type: list.type,
          created_by: list.created_by,
          filters: finalFilters
        }]);

      if (error) throw error;
      
      toast.success("List created successfully");
      refetch();
      setOpen(false);
    } catch (error) {
      console.error('Error creating list:', error);
      toast.error("Failed to create list");
    }
  };

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
        onCreateList={handleCreateList}
      />

      <ListSection title="Static Lists" lists={staticLists} />
      <ListSection title="Dynamic Lists" lists={dynamicLists} />
    </div>
  );
};

export default Lists;