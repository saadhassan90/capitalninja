import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Trash2, Edit, ListFilter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface List {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  type: 'static' | 'dynamic';
}

const Lists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListType, setNewListType] = useState<'static' | 'dynamic'>('static');
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
      setLists(data || []);
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

  const handleCreateList = async () => {
    try {
      const { data, error } = await supabase
        .from('lists')
        .insert([
          {
            name: newListName,
            description: newListDescription,
            type: newListType,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLists([data, ...lists]);
      setNewListName("");
      setNewListDescription("");
      setNewListType('static');

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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/80">
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
              <DialogDescription>
                Create a new list to organize your investors.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Enter list description"
                />
              </div>
              <div className="space-y-2">
                <Label>List Type</Label>
                <RadioGroup value={newListType} onValueChange={(value: 'static' | 'dynamic') => setNewListType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="static" id="static" />
                    <Label htmlFor="static">Static</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dynamic" id="dynamic" />
                    <Label htmlFor="dynamic">Dynamic</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-gray-100" />
              <CardContent className="h-12 bg-gray-50" />
            </Card>
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
            <Card key={list.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{list.name}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteList(list.id)}>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Lists;