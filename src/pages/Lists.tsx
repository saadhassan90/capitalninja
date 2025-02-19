import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import type { InvestorContact } from "@/types/investor-contact";

interface List {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
}

interface ListInvestorJoin {
  contact_id: string;
  investor_contacts: InvestorContact;
}

export default function Lists() {
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch lists
  const { data: lists, refetch: refetchLists } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("type", "static")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as List[];
    }
  });

  // Fetch investors for selected list
  const { data: listInvestors } = useQuery({
    queryKey: ["list-investors", selectedListId],
    queryFn: async () => {
      if (!selectedListId) return [];
      
      const { data, error } = await supabase
        .from("list_investors")
        .select(`
          contact_id,
          investor_contacts:contact_id (
            id,
            first_name,
            last_name,
            email,
            title,
            company_name,
            linkedin_url,
            phone
          )
        `)
        .eq("list_id", selectedListId);

      if (error) throw error;
      
      // Safely type and transform the data
      const typedData = data as unknown as ListInvestorJoin[];
      return typedData.map(item => item.investor_contacts).filter(Boolean);
    },
    enabled: !!selectedListId
  });

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("lists")
        .insert({
          name,
          description,
          created_by: user.id,
          type: "static"
        });

      if (error) throw error;

      toast.success("List created successfully");
      setShowNewListDialog(false);
      setName("");
      setDescription("");
      refetchLists();
    } catch (error: any) {
      console.error("Error creating list:", error);
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Investors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists?.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">{list.name}</TableCell>
                <TableCell>{list.description || "—"}</TableCell>
                <TableCell>{new Date(list.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="secondary"
                    onClick={() => navigate(`/lists/${list.id}`)}
                  >
                    View Investors
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!lists?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No lists found. Create your first list!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateList} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                placeholder="Enter list name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter list description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
