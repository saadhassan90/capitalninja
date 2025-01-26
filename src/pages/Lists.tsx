import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
      <h1 className="text-2xl font-bold mb-6">Lists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold">{list.name}</h2>
            {list.description && (
              <p className="text-gray-600 mt-2">{list.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <span
                className={`px-2 py-1 rounded-full ${
                  list.type === "static"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {list.type}
              </span>
              <span>
                Created:{" "}
                {new Date(list.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lists;