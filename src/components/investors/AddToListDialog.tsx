import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvestors: number[];
  onSuccess?: () => void;
  mode?: "copy" | "move";
  sourceListId?: string;
}

export function AddToListDialog({ 
  open, 
  onOpenChange,
  selectedInvestors,
  onSuccess,
  mode = "copy",
  sourceListId
}: AddToListDialogProps) {
  const [listMode, setListMode] = useState<"existing" | "new">("existing");
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [newList, setNewList] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: lists, isLoading: listsLoading } = useQuery({
    queryKey: ["static-lists"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("type", "static")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    if (selectedInvestors.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one contact or company to add to a list.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let targetListId = selectedListId;

      if (listMode === "new") {
        const { data: newListData, error: createError } = await supabase
          .from("lists")
          .insert({
            name: newList.name,
            description: newList.description,
            type: "static",
          })
          .select()
          .single();

        if (createError) throw createError;
        targetListId = newListData.id;
      }

      for (const id of selectedInvestors) {
        if (typeof id === 'number') {
          const { data: contacts, error: contactsError } = await supabase
            .rpc('get_company_contacts', { company_id: id });
          
          if (contactsError) throw contactsError;
          
          if (contacts && contacts.length > 0) {
            const listContacts = contacts.map(contact => ({
              list_id: targetListId,
              contact_id: contact.contact_id,
            }));

            const { error: insertError } = await supabase
              .from("list_investors")
              .insert(listContacts);

            if (insertError) throw insertError;
          }
        } else {
          const { error: insertError } = await supabase
            .from("list_investors")
            .insert({
              list_id: targetListId,
              contact_id: id,
            });

          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Success",
        description: `Successfully added contacts to the list`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to add to list`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {mode === "move" ? "Move to List" : "Copy to List"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "move" ? "Move" : "Copy"} selected investors to an existing list or create a new one
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <RadioGroup
            value={listMode}
            onValueChange={(value: "existing" | "new") => setListMode(value)}
            className="flex flex-col space-y-4"
          >
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="text-lg font-medium">
                  Add to existing list
                </Label>
              </div>
              {listMode === "existing" && (
                <div className="pl-6 space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Select a list from your existing static lists
                  </p>
                  {listsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : lists && lists.length > 0 ? (
                    <RadioGroup
                      value={selectedListId}
                      onValueChange={setSelectedListId}
                      className="flex flex-col space-y-2"
                    >
                      {lists.map((list) => (
                        <div key={list.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={list.id} id={list.id} />
                          <Label htmlFor={list.id} className="font-medium">{list.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-sm text-muted-foreground">No lists found. Create a new one!</p>
                  )}
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="text-lg font-medium">
                  Create new list
                </Label>
              </div>
              {listMode === "new" && (
                <div className="pl-6 space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Create a new list to add your selected investors
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">List Name</Label>
                    <Input
                      id="name"
                      value={newList.name}
                      onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                      placeholder="Enter list name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={newList.description}
                      onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                      placeholder="Enter list description"
                    />
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || (listMode === "existing" && !selectedListId) || (listMode === "new" && !newList.name)}
            className="bg-black hover:bg-black/80"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "move" ? "Moving..." : "Copying..."}
              </>
            ) : (
              mode === "move" ? "Move to List" : "Copy to List"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
