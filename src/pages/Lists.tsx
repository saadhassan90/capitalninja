import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ListFilters {
  type: string;
  location: string;
  assetClass: string;
  firstTimeFunds: string;
  aumRange: [number, number];
}

interface DatabaseList {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  filters: Json;
  last_refreshed_at: string;
}

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
  type: "static" | "dynamic";
  filters: ListFilters | null;
  last_refreshed_at: string;
}

const Lists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [open, setOpen] = useState(false);
  const [newList, setNewList] = useState({
    name: "",
    description: "",
    type: "static" as "static" | "dynamic"
  });

  const { isLoading } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const typedLists = (data as DatabaseList[]).map((list) => ({
        ...list,
        filters: list.filters ? (list.filters as unknown as ListFilters) : null,
      }));

      setLists(typedLists);
      return typedLists;
    },
  });

  const staticLists = lists.filter(list => list.type === 'static');
  const dynamicLists = lists.filter(list => list.type === 'dynamic');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const EmptySection = ({ type }: { type: string }) => (
    <Alert variant="default" className="bg-gray-50 border-gray-200">
      <AlertDescription>
        No {type.toLowerCase()} lists found. Create a new {type.toLowerCase()} list by clicking the "New List" button.
      </AlertDescription>
    </Alert>
  );

  const ListSection = ({ title, lists }: { title: string; lists: List[] }) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
      {lists.length === 0 ? (
        <EmptySection type={title.split(" ")[0]} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <Card key={list.id} className="border-gray-200 hover:shadow-md transition-shadow">
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
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-card-foreground">Lists</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-black hover:bg-black/80">
              <Plus className="w-4 h-4 mr-2" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  placeholder="Enter list name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newList.description}
                  onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                  placeholder="Enter list description"
                />
              </div>
              <div className="space-y-2">
                <Label>List Type</Label>
                <RadioGroup
                  value={newList.type}
                  onValueChange={(value: "static" | "dynamic") => 
                    setNewList({ ...newList, type: value })
                  }
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="static" id="static" />
                    <Label htmlFor="static">Static List</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dynamic" id="dynamic" />
                    <Label htmlFor="dynamic">Dynamic List</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ListSection title="Static Lists" lists={staticLists} />
      <ListSection title="Dynamic Lists" lists={dynamicLists} />
    </div>
  );
};

export default Lists;