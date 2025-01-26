import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ListFilter } from "lucide-react";

interface List {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  type: "static" | "dynamic";
}

interface ListCardProps {
  list: List;
  onDelete: (id: string) => void;
}

export const ListCard = ({ list, onDelete }: ListCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{list.name}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onDelete(list.id)}>
              <Trash2 className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>{list.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500 capitalize">{list.type} List</span>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Created {new Date(list.created_at).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};