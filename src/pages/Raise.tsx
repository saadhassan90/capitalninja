import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRaiseDialog } from "@/components/raise/CreateRaiseDialog";
import { RaiseTable } from "@/components/raise/RaiseTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Raise = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: raises, refetch } = useQuery({
    queryKey: ['raises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raises')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Raise</h1>
            <p className="text-muted-foreground mt-2">
              Manage your fundraising projects and track progress
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <RaiseTable 
        raises={raises || []}
        onUpdate={refetch}
      />

      <CreateRaiseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateRaise={refetch}
      />
    </div>
  );
};

export default Raise;