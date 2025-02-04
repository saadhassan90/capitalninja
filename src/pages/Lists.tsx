import { useState } from "react";
import { ListSection } from "@/components/lists/ListSection";
import { ListChecks, Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  last_refreshed_at: string | null;
}

const Lists = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: lists, isLoading, error, refetch } = useQuery({
    queryKey: ['lists'],
    queryFn: async () => {
      console.log("Fetching lists...");
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching lists:", error);
        throw error;
      }
      
      console.log("Fetched lists:", data);
      return (data as List[]) || [];
    }
  });

  const handleCreateList = async (listData: any) => {
    try {
      const { error } = await supabase
        .from('lists')
        .insert({
          ...listData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success("List created successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create list");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load lists. Please try again later.
          </AlertDescription>
        </Alert>
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
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-black hover:bg-black/80">
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

      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateList={handleCreateList}
      />
    </div>
  );
};

export default Lists;