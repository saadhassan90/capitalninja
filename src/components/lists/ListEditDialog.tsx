import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ListEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list: {
    id: string;
    name: string;
    description: string;
  };
}

export function ListEditDialog({ open, onOpenChange, list }: ListEditDialogProps) {
  const { toast } = useToast();
  const [editForm, setEditForm] = useState({
    name: list.name,
    description: list.description || "",
  });

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('lists')
        .update({
          name: editForm.name,
          description: editForm.description,
        })
        .eq('id', list.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "List updated successfully",
      });

      onOpenChange(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update list",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit List</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit} disabled={!editForm.name}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}