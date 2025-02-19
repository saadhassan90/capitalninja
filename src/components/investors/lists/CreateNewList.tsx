
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateNewListProps {
  newList: { name: string; description: string };
  onChange: (values: { name: string; description: string }) => void;
}

export function CreateNewList({ newList, onChange }: CreateNewListProps) {
  return (
    <div className="pl-6 space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Create a new list to add your selected investors
      </p>
      <div className="space-y-2">
        <Label htmlFor="name" className="font-medium">List Name</Label>
        <Input
          id="name"
          value={newList.name}
          onChange={(e) => onChange({ ...newList, name: e.target.value })}
          placeholder="Enter list name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">Description</Label>
        <Textarea
          id="description"
          value={newList.description}
          onChange={(e) => onChange({ ...newList, description: e.target.value })}
          placeholder="Enter list description"
        />
      </div>
    </div>
  );
}
