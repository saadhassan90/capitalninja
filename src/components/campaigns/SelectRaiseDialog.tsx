import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectRaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
}

export function SelectRaiseDialog({ open, onOpenChange, listId }: SelectRaiseDialogProps) {
  const navigate = useNavigate();
  const [selectedRaiseId, setSelectedRaiseId] = useState<string>("");

  const { data: raises } = useQuery({
    queryKey: ["raises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("raises")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleContinue = () => {
    if (selectedRaiseId) {
      navigate("/campaigns/new", { 
        state: { 
          listId,
          raiseId: selectedRaiseId 
        } 
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Raise for Campaign</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="raise">Select a Raise</Label>
            <Select
              value={selectedRaiseId}
              onValueChange={setSelectedRaiseId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a raise" />
              </SelectTrigger>
              <SelectContent>
                {raises?.map((raise) => (
                  <SelectItem key={raise.id} value={raise.id}>
                    {raise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!selectedRaiseId}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}