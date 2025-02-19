
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AddToExistingList } from "./lists/AddToExistingList";
import { CreateNewList } from "./lists/CreateNewList";
import { useAddToList } from "./lists/useAddToList";

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvestors: string[];
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
  
  const { isSubmitting, addToList } = useAddToList({ onSuccess, onOpenChange });

  const handleSubmit = () => {
    addToList({
      selectedInvestors,
      targetListId: selectedListId,
      isNewList: listMode === "new",
      newList: listMode === "new" ? newList : undefined
    });
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
                <AddToExistingList
                  selectedListId={selectedListId}
                  onSelectList={setSelectedListId}
                />
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
                <CreateNewList
                  newList={newList}
                  onChange={setNewList}
                />
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
