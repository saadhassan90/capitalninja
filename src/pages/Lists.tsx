
import { useState } from "react";
import { ListSection } from "@/components/lists/ListSection";
import { ListChecks, Plus, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lists</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <ListChecks className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your investor lists
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </div>
      
      <ListSection lists={lists || []} />

      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateList={handleCreateList}
      />
    </div>
  );
}

export default Lists;
