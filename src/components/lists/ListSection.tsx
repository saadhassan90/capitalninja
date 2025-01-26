import { Alert, AlertDescription } from "@/components/ui/alert";
import { ListCard } from "./ListCard";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
}

interface ListSectionProps {
  title: string;
  lists: List[];
}

function EmptySection({ type }: { type: string }) {
  return (
    <Alert variant="default" className="bg-gray-50 border-gray-200">
      <AlertDescription>
        No {type.toLowerCase()} lists found. Create a new {type.toLowerCase()} list by clicking the "New List" button.
      </AlertDescription>
    </Alert>
  );
}

export function ListSection({ title, lists }: ListSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
      {lists.length === 0 ? (
        <EmptySection type={title.split(" ")[0]} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}