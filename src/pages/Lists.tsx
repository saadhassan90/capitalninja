import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreateListDialog } from "@/components/lists/CreateListDialog";
import { ListCard } from "@/components/lists/ListCard";

interface List {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  type: "static" | "dynamic";
}

const Lists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure the type is either "static" or "dynamic"
      const typedData = data?.map(item => ({
        ...item,
        type: item.type === "dynamic" ? "dynamic" : "static"
      } as List));
      
      setLists(typedData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load lists. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async (name: string, description: string, type: "static" | "dynamic") => {
    try {
      const { data, error } = await supabase
        .from('lists')
        .insert([
          {
            name,
            description,
            type,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Ensure type is correctly typed
      const newList = {
        ...data,
        type: data.type === "dynamic" ? "dynamic" : "static"
      } as List;

      setLists([newList, ...lists]);

      toast({
        title: "Success",
        description: "List created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLists(lists.filter((list) => list.id !== id));
      toast({
        title: "Success",
        description: "List deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete list. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lists</h1>
          <p className="text-gray-500 mt-1">Manage your investor lists</p>
        </div>
        <CreateListDialog onCreateList={handleCreateList} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-100 rounded-lg mb-4" />
              <div className="h-12 bg-gray-50 rounded-lg" />
            </div>
          ))}
        </div>
      ) : lists.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lists yet</h3>
          <p className="text-gray-500">Create a list to start organizing investors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard 
              key={list.id} 
              list={list} 
              onDelete={handleDeleteList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lists;