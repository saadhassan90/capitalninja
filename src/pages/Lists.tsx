import { useState } from "react";
import { ListSection } from "@/components/lists/ListSection";
import { ListChecks, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { toast } from "sonner";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

interface List {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  type: "static" | "dynamic";
  last_refreshed_at: string | null;
}

interface ListFilters {
  type: InvestorFilterType;
  location: InvestorFilterType;
  assetClass: InvestorFilterType;
  firstTimeFunds: InvestorFilterType;
  aumRange: AUMRange;
}

interface CreateListData {
  name: string;
  description: string;
  type: "static" | "dynamic";
  created_by: string;
  filters?: ListFilters;
}

const Lists = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: lists, isLoading, error } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data as List[] || []).map(list => ({
        ...list,
        description: list.description || '',
        last_refreshed_at: list.last_refreshed_at || null
      }));
    }
  });

  const handleCreateList = async (listData: CreateListData) => {
    try {
      const { error } = await supabase
        .from('lists')
        .insert({
          name: listData.name,
          description: listData.description,
          type: listData.type,
          created_by: listData.created_by,
          filters: listData.filters ? JSON.parse(JSON.stringify(listData.filters)) : null
        });

      if (error) throw error;

      toast.success("List created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create list");
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-destructive">
          Failed to load lists. Please try again later.
        </div>
      </div>
    );
  }

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
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading lists...</div>
      ) : (
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
      )}

      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateList={handleCreateList}
      />
    </div>
  );
};

export default Lists;