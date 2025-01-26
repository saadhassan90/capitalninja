import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
}

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{list.name}</CardTitle>
          <span className={`px-2 py-1 text-xs rounded-full ${
            list.type === "static"
              ? "bg-black/10 text-black"
              : "bg-gray-100 text-gray-700"
          }`}>
            {list.type}
          </span>
        </div>
        {list.description && (
          <CardDescription className="text-muted-foreground mt-2">
            {list.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(list.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}