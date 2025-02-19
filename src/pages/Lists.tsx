
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import { ListsTable } from "@/components/lists/ListsTable";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface NewListForm {
  name: string;
  description?: string;
}

export default function Lists() {
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<NewListForm>({
    defaultValues: {
      name: "",
      description: "",
    }
  });

  const handleCreateList = async (data: NewListForm) => {
    try {
      const { error } = await supabase
        .from("lists")
        .insert({
          name: data.name,
          description: data.description,
          created_by: user?.id,
          type: "static"
        });

      if (error) throw error;

      toast.success("List created successfully");
      setShowNewListDialog(false);
      form.reset();
    } catch (error: any) {
      toast.error("Error creating list: " + error.message);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
          <p className="text-muted-foreground">
            Create and manage your investor lists
          </p>
        </div>
        <Button onClick={() => setShowNewListDialog(true)}>
          <ListPlus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>

      <ListsTable />

      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreateList)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                placeholder="Enter list name"
                {...form.register("name", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter list description"
                {...form.register("description")}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewListDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create List</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
