import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DynamicListFilters } from "./DynamicListFilters";
import { useAuth } from "@/components/AuthProvider";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateList: (list: {
    name: string;
    description: string;
    type: "static" | "dynamic";
    created_by: string;
    filters?: {
      type: InvestorFilterType;
      location: InvestorFilterType;
      assetClass: InvestorFilterType;
      firstTimeFunds: InvestorFilterType;
      aumRange: AUMRange;
    };
  }) => void;
}

export function CreateListDialog({ open, onOpenChange, onCreateList }: CreateListDialogProps) {
  const { user } = useAuth();
  const [newList, setNewList] = useState({
    name: "",
    description: "",
    type: "static" as "static" | "dynamic",
    filters: {
      type: null as InvestorFilterType,
      location: null as InvestorFilterType,
      assetClass: null as InvestorFilterType,
      firstTimeFunds: null as InvestorFilterType,
      aumRange: null as AUMRange,
    },
  });

  const handleCreate = () => {
    if (!user) return;
    
    const listData = {
      name: newList.name,
      description: newList.description,
      type: newList.type,
      created_by: user.id,
      ...(newList.type === 'dynamic' && { filters: newList.filters }),
    };
    
    onCreateList(listData);
    
    onOpenChange(false);
    setNewList({
      name: "",
      description: "",
      type: "static",
      filters: {
        type: null,
        location: null,
        assetClass: null,
        firstTimeFunds: null,
        aumRange: null,
      },
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
          <div className="space-y-2">
            <Label>List Type</Label>
            <RadioGroup
              value={newList.type}
              onValueChange={(value: "static" | "dynamic") => 
                setNewList({ ...newList, type: value })
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="static" id="static" />
                <Label htmlFor="static">Static List</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dynamic" id="dynamic" />
                <Label htmlFor="dynamic">Dynamic List</Label>
              </div>
            </RadioGroup>
          </div>
          {newList.type === "dynamic" && (
            <DynamicListFilters
              onFiltersChange={(filters) => setNewList({ ...newList, filters })}
            />
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-black hover:bg-black/80">
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}