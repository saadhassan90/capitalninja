
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateList: (list: {
    name: string;
    description: string;
    created_by: string;
  }) => void;
}

export function CreateListDialog({ open, onOpenChange, onCreateList }: CreateListDialogProps) {
  const { user } = useAuth();
  const [newList, setNewList] = useState({
    name: "",
    description: "",
  });

  const handleCreate = () => {
    if (!user) {
      toast.error("You must be logged in to create a list");
      return;
    }
    
    const listData = {
      name: newList.name,
      description: newList.description,
      created_by: user.id,
    };
    
    onCreateList(listData);
    
    onOpenChange(false);
    setNewList({
      name: "",
      description: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-6 pr-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newList.name}
              onChange={(e) => setNewList({ ...newList, name: e.target.value })}
              placeholder="Enter list name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newList.description}
              onChange={(e) => setNewList({ ...newList, description: e.target.value })}
              placeholder="Enter list description"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!newList.name || !user}
            className="bg-black hover:bg-black/80"
          >
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
