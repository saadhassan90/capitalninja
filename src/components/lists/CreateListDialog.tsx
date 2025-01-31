import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DynamicListFilters } from "./DynamicListFilters";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

interface ListFilters {
  type: InvestorFilterType;
  location: InvestorFilterType;
  assetClass: InvestorFilterType;
  firstTimeFunds: InvestorFilterType;
  aumRange: AUMRange;
}

interface CreateListData {
  name: string;
  description: string;
  type: "static" | "dynamic";
  created_by: string;
  filters?: ListFilters;
}

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateList: (list: CreateListData) => void;
}

export function CreateListDialog({ open, onOpenChange, onCreateList }: CreateListDialogProps) {
  const { user } = useAuth();
  const [newList, setNewList] = useState<CreateListData>({
    name: "",
    description: "",
    type: "static",
    created_by: user?.id || "",
    filters: {
      type: null,
      location: null,
      assetClass: null,
      firstTimeFunds: null,
      aumRange: null,
    },
  });

  const hasAtLeastOneFilter = () => {
    if (!newList.filters) return false;
    const { type, location, assetClass, firstTimeFunds, aumRange } = newList.filters;
    return type !== null || location !== null || assetClass !== null || 
           firstTimeFunds !== null || (aumRange !== null && aumRange.length === 2);
  };

  const handleCreate = () => {
    if (!user) return;
    
    if (newList.type === 'dynamic' && !hasAtLeastOneFilter()) {
      toast.error("Please set at least one filter for dynamic lists");
      return;
    }

    onCreateList(newList);
    
    onOpenChange(false);
    setNewList({
      name: "",
      description: "",
      type: "static",
      created_by: user.id,
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
          <Button 
            onClick={handleCreate} 
            disabled={!newList.name}
            className="bg-black hover:bg-black/80"
          >
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}