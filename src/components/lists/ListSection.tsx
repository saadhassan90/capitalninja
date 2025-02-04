import { Alert, AlertDescription } from "@/components/ui/alert";
import { ListCard } from "./ListCard";
import { useState } from "react";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface ListSectionProps {
  lists: List[];
}

function EmptySection() {
  return (
    <Alert variant="default" className="bg-background border-border">
      <AlertDescription className="text-muted-foreground">
        No lists found. Create a new list by clicking the "New List" button.
      </AlertDescription>
    </Alert>
  );
}

export function ListSection({ lists: initialLists }: ListSectionProps) {
  const [lists, setLists] = useState(initialLists);
  console.log('Lists:', lists); // Debug log

  const handleDelete = (deletedListId: string) => {
    setLists(currentLists => currentLists.filter(list => list.id !== deletedListId));
  };

  return (
    <div className="space-y-4">
      {lists.length === 0 ? (
        <EmptySection />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard 
              key={list.id} 
              list={list} 
              onDelete={() => handleDelete(list.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}