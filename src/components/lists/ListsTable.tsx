
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";

interface List {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
  type: string;
}

export function ListsTable() {
  const [selectedLists, setSelectedLists] = useState<string[]>([]);

  const { data: lists, isLoading, refetch } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as List[];
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && lists) {
      setSelectedLists(lists.map(list => list.id));
    } else {
      setSelectedLists([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLists(prev => [...prev, id]);
    } else {
      setSelectedLists(prev => prev.filter(listId => listId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("lists")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("List deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from("lists")
        .delete()
        .in("id", selectedLists);

      if (error) throw error;

      toast.success("Lists deleted successfully");
      setSelectedLists([]);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      {selectedLists.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedLists.length} list{selectedLists.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={lists?.length > 0 && selectedLists.length === lists.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !lists?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No lists found
                </TableCell>
              </TableRow>
            ) : (
              lists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLists.includes(list.id)}
                      onCheckedChange={(checked) => handleSelect(list.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{list.name}</TableCell>
                  <TableCell>{list.description || '-'}</TableCell>
                  <TableCell className="capitalize">{list.type}</TableCell>
                  <TableCell>
                    {format(new Date(list.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View List
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(list.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
