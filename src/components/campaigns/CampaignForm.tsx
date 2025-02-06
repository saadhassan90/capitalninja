import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultListId?: string;
}

export function CampaignForm({ open, onOpenChange, defaultListId }: CampaignFormProps) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedListId, setSelectedListId] = useState(defaultListId || "");

  const { data: lists } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("campaigns").insert({
        name,
        subject: "Draft", // Default subject for draft campaigns
        content: "Draft", // Default content for draft campaigns
        list_id: selectedListId,
        source_list_id: selectedListId,
        status: "draft",
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      toast.success("Campaign created successfully");
      onOpenChange(false);
      navigate("/campaigns");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {!defaultListId && (
            <div className="space-y-2">
              <Label htmlFor="list">Select List</Label>
              <Select
                value={selectedListId}
                onValueChange={setSelectedListId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  {lists?.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}