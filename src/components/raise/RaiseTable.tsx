import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, FileText, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { EditRaiseDialog } from "./EditRaiseDialog";
import { MemoDialog } from "./card/MemoDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { RaiseProject } from "./types";

interface RaiseTableProps {
  raises: RaiseProject[];
  onUpdate: () => void;
}

export function RaiseTable({ raises, onUpdate }: RaiseTableProps) {
  const [selectedRaises, setSelectedRaises] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [selectedRaise, setSelectedRaise] = useState<RaiseProject | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('raises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      onUpdate();
      setSelectedRaises(prev => prev.filter(raiseId => raiseId !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('raises')
        .delete()
        .in('id', selectedRaises);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedRaises.length} projects deleted successfully`,
      });

      onUpdate();
      setSelectedRaises([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete projects",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRaises(raises.map(raise => raise.id));
    } else {
      setSelectedRaises([]);
    }
  };

  const handleSelectRaise = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRaises(prev => [...prev, id]);
    } else {
      setSelectedRaises(prev => prev.filter(raiseId => raiseId !== id));
    }
  };

  return (
    <div className="space-y-4">
      {selectedRaises.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedRaises.length} project{selectedRaises.length !== 1 ? 's' : ''} selected
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedRaises.length} selected project{selectedRaises.length !== 1 ? 's' : ''}.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete}>
                  Delete Projects
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={raises.length > 0 && selectedRaises.length === raises.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Target Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {raises.map((raise) => (
              <TableRow key={raise.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRaises.includes(raise.id)}
                    onCheckedChange={(checked) => handleSelectRaise(raise.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{raise.name}</TableCell>
                <TableCell>{raise.type}</TableCell>
                <TableCell>{raise.category}</TableCell>
                <TableCell>{raise.target_amount ? formatCurrency(raise.target_amount) : 'N/A'}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    raise.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {raise.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(raise.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRaise(raise);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRaise(raise);
                        setMemoDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the project "{raise.name}".
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(raise.id)}>
                            Delete Project
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRaise && (
        <>
          <EditRaiseDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            project={selectedRaise}
            onUpdate={onUpdate}
          />
          <MemoDialog
            open={memoDialogOpen}
            onOpenChange={setMemoDialogOpen}
            projectName={selectedRaise.name}
            memo={selectedRaise.memo || ''}
          />
        </>
      )}
    </div>
  );
}