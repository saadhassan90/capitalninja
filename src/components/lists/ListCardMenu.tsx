import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ListCardMenuProps {
  listName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ListCardMenu({ listName, onView, onEdit, onDelete }: ListCardMenuProps) {
  const handleClone = async () => {
    try {
      // First, get all lists to check for existing names
      const { data: existingLists } = await supabase
        .from('lists')
        .select('name');

      // Find the highest number suffix for this list name
      const baseNameRegex = new RegExp(`^${listName}( \\(\\d+\\))?$`);
      const matchingNames = existingLists
        ?.filter(list => baseNameRegex.test(list.name))
        .map(list => list.name) || [];

      let newName = listName;
      if (matchingNames.length > 0) {
        // Extract numbers from existing names and find the highest
        const numbers = matchingNames
          .map(name => {
            const match = name.match(/\((\d+)\)$/);
            return match ? parseInt(match[1]) : 0;
          });
        const highestNumber = Math.max(...numbers, 0);
        newName = `${listName} (${highestNumber + 1})`;
      }

      // Get the original list data
      const { data: originalList } = await supabase
        .from('lists')
        .select('id, description, created_by')
        .eq('name', listName)
        .single();

      if (!originalList) throw new Error('Original list not found');

      // Create the new list
      const { data: newList, error: createError } = await supabase
        .from('lists')
        .insert({
          name: newName,
          description: originalList.description,
          created_by: originalList.created_by,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Get all investors from the original list
      const { data: listInvestors } = await supabase
        .from('list_investors')
        .select('investor_id')
        .eq('list_id', originalList.id);

      if (listInvestors && listInvestors.length > 0 && newList) {
        // Clone the list_investors relationships
        const newListInvestors = listInvestors.map(li => ({
          list_id: newList.id,
          investor_id: li.investor_id,
        }));

        const { error: investorsError } = await supabase
          .from('list_investors')
          .insert(newListInvestors);

        if (investorsError) throw investorsError;
      }

      toast.success('List cloned successfully');
      // Trigger a refresh of the lists
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to clone list');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleClone}>Clone</DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}