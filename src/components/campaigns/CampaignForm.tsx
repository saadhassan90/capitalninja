import { useState, useEffect } from "react";
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
import type { Campaign } from "@/types/campaign";

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultListId?: string;
  campaign?: Campaign;
}

export function CampaignForm({ open, onOpenChange, defaultListId, campaign }: CampaignFormProps) {
  const navigate = useNavigate();
  const isEditing = !!campaign;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedListId, setSelectedListId] = useState(defaultListId || "");
  const [selectedRaiseId, setSelectedRaiseId] = useState("");

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setSelectedListId(campaign.list_id || "");
      setSelectedRaiseId(campaign.raise?.id || "");
    }
  }, [campaign]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("campaigns")
          .update({
            name,
            list_id: selectedListId,
            source_list_id: selectedListId,
            raise_id: selectedRaiseId || null,
          })
          .eq('id', campaign.id);

        if (error) throw error;

        toast.success("Campaign updated successfully");
        navigate(0); // Refresh the page to show updated data
      } else {
        const { error } = await supabase.from("campaigns").insert({
          name,
          subject: "Draft",
          content: "Draft",
          list_id: selectedListId,
          source_list_id: selectedListId,
          raise_id: selectedRaiseId || null,
          status: "draft",
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

        if (error) throw error;

        toast.success("Campaign created successfully");
        navigate("/campaigns");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Campaign" : "Create New Campaign"}</DialogTitle>
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

          <div className="space-y-2">
            <Label htmlFor="raise">Select Raise (Optional)</Label>
            <Select
              value={selectedRaiseId}
              onValueChange={setSelectedRaiseId}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Campaign" : "Create Campaign")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}