import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Trash, ArrowRight } from "lucide-react";
import { AddToListDialog } from "./AddToListDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BulkActionsProps {
  selectedCount: number;
  selectedInvestors: number[];
  onClearSelection: () => void;
  listId: string;
}

export function BulkActions({ selectedCount, selectedInvestors, onClearSelection, listId }: BulkActionsProps) {
  const [showMoveToList, setShowMoveToList] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("list_investors")
        .delete()
        .eq("list_id", listId)
        .in("investor_id", selectedInvestors);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Removed ${selectedCount} investor${selectedCount !== 1 ? 's' : ''} from the list`,
      });
      onClearSelection();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove investors from list",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md ml-auto">
      <span className="text-sm font-medium">
        {selectedCount} investor{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowMoveToList(true)}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Move to List
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove {selectedCount} investor{selectedCount !== 1 ? 's' : ''} from this list. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <AddToListDialog
        open={showMoveToList}
        onOpenChange={setShowMoveToList}
        selectedInvestors={selectedInvestors}
        onSuccess={onClearSelection}
        mode="move"
        sourceListId={listId}
      />
    </div>
  );
}