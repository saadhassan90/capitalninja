import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  selectedInvestors: number[];
}

export function BulkActions({ selectedCount, onClearSelection, selectedInvestors }: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateList = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create new list
      const { data: listData, error: listError } = await supabase
        .from('lists')
        .insert([{ 
          name, 
          description,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (listError) throw listError;

      // Add investors to list
      const investorsToAdd = selectedInvestors.map(investorId => ({
        list_id: listData.id,
        investor_id: investorId,
      }));

      const { error: investorsError } = await supabase
        .from('list_investors')
        .insert(investorsToAdd);

      if (investorsError) throw investorsError;

      toast({
        title: "Success",
        description: "List created successfully",
      });
      
      setIsOpen(false);
      onClearSelection();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md ml-auto">
      <span className="text-sm font-medium">
        {selectedCount} investor{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-black hover:bg-black/80"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
              <DialogDescription>
                Create a new list with the selected investors
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">List Name</Label>
                <Input
                  id="name"
                  placeholder="Enter list name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter list description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateList}
                disabled={isLoading}
                className="bg-black hover:bg-black/80"
              >
                {isLoading ? "Creating..." : "Create List"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}