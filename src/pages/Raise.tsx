
import { useState } from "react";
import { RaiseTable } from "@/components/raise/RaiseTable";
import { Briefcase, Plus, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RaiseDialog } from "@/components/raise/RaiseDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Raise = () => {
  const [showDialog, setShowDialog] = useState(false);
  
  const { data: raises, refetch } = useQuery({
    queryKey: ['raises'],
    queryFn: async () => {
      console.log('Fetching raises...');
      const { data: raisesData, error } = await supabase
        .from('raises')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching raises:', error);
        throw error;
      }
      
      console.log('Fetched raises:', raisesData);
      return raisesData || [];
    }
  });

  return (
    <div className="flex-1 space-y-6 p-8">
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
            <BreadcrumbPage>Raise</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Raise</h1>
            <p className="text-muted-foreground mt-1">
              View your fundraising projects
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4" />
          Create Raise
        </Button>
      </div>
      
      <RaiseTable 
        raises={raises || []}
        onUpdate={refetch}
      />

      <RaiseDialog 
        open={showDialog} 
        onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) {
            refetch(); // Refetch data when dialog closes
          }
        }}
      />
    </div>
  );
};

export default Raise;
