import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { QueryObserverResult } from "@tanstack/react-query";

interface RefreshListButtonProps {
  onRefresh: () => Promise<QueryObserverResult<any, Error>>;
}

export function RefreshListButton({ onRefresh }: RefreshListButtonProps) {
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      const { error: refreshError } = await supabase.rpc('refresh_dynamic_lists');
      if (refreshError) throw refreshError;

      await onRefresh();

      toast({
        title: "List Refreshed",
        description: "The list has been updated with the latest data.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to refresh the list. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleRefresh}
      variant="outline"
      size="sm"
      className="ml-auto"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh List
    </Button>
  );
}