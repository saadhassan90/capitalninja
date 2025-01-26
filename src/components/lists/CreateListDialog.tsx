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
import { TypeFilter } from "@/components/investors/filters/TypeFilter";
import { LocationFilter } from "@/components/investors/filters/LocationFilter";
import { AssetClassFilter } from "@/components/investors/filters/AssetClassFilter";
import { FirstTimeFundsFilter } from "@/components/investors/filters/FirstTimeFundsFilter";
import { AUMRangeFilter } from "@/components/investors/filters/AUMRangeFilter";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

interface CreateListDialogProps {
  onCreateList: (name: string, description: string, type: "static" | "dynamic", filters?: {
    type: InvestorFilterType;
    location: InvestorFilterType;
    assetClass: InvestorFilterType;
    firstTimeFunds: InvestorFilterType;
    aumRange: AUMRange;
  }) => void;
}

export const CreateListDialog = ({ onCreateList }: CreateListDialogProps) => {
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListType, setNewListType] = useState<"static" | "dynamic">("static");
  const [selectedType, setSelectedType] = useState<InvestorFilterType>(null);
  const [selectedLocation, setSelectedLocation] = useState<InvestorFilterType>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<InvestorFilterType>(null);
  const [selectedFirstTimeFunds, setSelectedFirstTimeFunds] = useState<InvestorFilterType>(null);
  const [selectedAUMRange, setSelectedAUMRange] = useState<AUMRange>(null);
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    const filters = newListType === "dynamic" ? {
      type: selectedType,
      location: selectedLocation,
      assetClass: selectedAssetClass,
      firstTimeFunds: selectedFirstTimeFunds,
      aumRange: selectedAUMRange,
    } : undefined;

    onCreateList(newListName, newListDescription, newListType, filters);
    setNewListName("");
    setNewListDescription("");
    setNewListType("static");
    setSelectedType(null);
    setSelectedLocation(null);
    setSelectedAssetClass(null);
    setSelectedFirstTimeFunds(null);
    setSelectedAUMRange(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-black/80">
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
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

          {newListType === "dynamic" && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <Label className="block mb-4">Filter Criteria</Label>
              <div className="space-y-4">
                <TypeFilter onTypeChange={setSelectedType} />
                <LocationFilter onLocationChange={setSelectedLocation} />
                <AssetClassFilter onAssetClassChange={setSelectedAssetClass} />
                <FirstTimeFundsFilter onFirstTimeFundsChange={setSelectedFirstTimeFunds} />
                <AUMRangeFilter onAUMRangeChange={setSelectedAUMRange} />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} className="bg-black hover:bg-black/80">Create List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};