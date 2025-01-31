import { Alert, AlertDescription } from "@/components/ui/alert";
import { ListCard } from "./ListCard";
import { useState } from "react";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  last_refreshed_at: string | null;
}

interface ListSectionProps {
  title: string;
  lists: List[];
}

function EmptySection({ type }: { type: string }) {
  return (
    <Alert variant="default" className="bg-background border-border">
      <AlertDescription className="text-muted-foreground">
        No {type.toLowerCase()} lists found. Create a new {type.toLowerCase()} list by clicking the "New List" button.
      </AlertDescription>
    </Alert>
  );
}

export function ListSection({ title, lists: initialLists }: ListSectionProps) {
  const [lists, setLists] = useState(initialLists);

  const handleDelete = (deletedListId: string) => {
    setLists(currentLists => currentLists.filter(list => list.id !== deletedListId));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {!lists || lists.length === 0 ? (
        <EmptySection type={title.split(" ")[0]} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard 
              key={list.id} 
              list={{
                ...list,
                description: list.description || '',
                last_refreshed_at: list.last_refreshed_at || null
              }}
              onDelete={() => handleDelete(list.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}