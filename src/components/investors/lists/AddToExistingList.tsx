
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useStaticLists } from "./useStaticLists";

interface AddToExistingListProps {
  selectedListId: string;
  onSelectList: (id: string) => void;
}

export function AddToExistingList({ selectedListId, onSelectList }: AddToExistingListProps) {
  const { data: lists, isLoading: listsLoading } = useStaticLists();

  return (
    <div className="pl-6 space-y-2">
      <p className="text-sm text-muted-foreground mb-3">
        Select a list from your existing static lists
      </p>
      {listsLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : lists && lists.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {lists.map((list) => (
            <div key={list.id} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={list.id} 
                id={list.id} 
                checked={selectedListId === list.id}
                onClick={() => onSelectList(list.id)}
              />
              <Label htmlFor={list.id} className="font-medium">{list.name}</Label>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No lists found. Create a new one!</p>
      )}
    </div>
  );
}
