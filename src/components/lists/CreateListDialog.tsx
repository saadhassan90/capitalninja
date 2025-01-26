import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateListDialogProps {
  onCreateList: (name: string, description: string, type: "static" | "dynamic") => void;
}

export const CreateListDialog = ({ onCreateList }: CreateListDialogProps) => {
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListType, setNewListType] = useState<"static" | "dynamic">("static");

  const handleCreate = () => {
    onCreateList(newListName, newListDescription, newListType);
    setNewListName("");
    setNewListDescription("");
    setNewListType("static");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-black/80">
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Create a new list to organize your investors.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              placeholder="Enter list description"
            />
          </div>
          <div className="space-y-2">
            <Label>List Type</Label>
            <RadioGroup 
              value={newListType} 
              onValueChange={(value: "static" | "dynamic") => setNewListType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="static" id="static" />
                <Label htmlFor="static">Static</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dynamic" id="dynamic" />
                <Label htmlFor="dynamic">Dynamic</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Create List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};