import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lists</h1>
        <Button variant="default" className="bg-black hover:bg-black/80">
          <Plus className="w-4 h-4 mr-2" />
          New List
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-card text-card-foreground"
          >
            <h2 className="text-lg font-semibold">{list.name}</h2>
            {list.description && (
              <p className="text-muted-foreground mt-2">{list.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4 text-sm">
              <span
                className={`px-2 py-1 rounded-full ${
                  list.type === "static"
                    ? "bg-black/10 text-black"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {list.type}
              </span>
              <span className="text-muted-foreground">
                Created: {new Date(list.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lists;