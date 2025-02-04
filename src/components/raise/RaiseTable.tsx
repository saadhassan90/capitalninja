import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditRaiseDialog } from "./EditRaiseDialog";
import { MemoDialog } from "./card/MemoDialog";
import { BulkActions } from "./table/BulkActions";
import { RaiseTableRow } from "./table/RaiseTableRow";
import type { RaiseProject } from "./types";

interface RaiseTableProps {
  raises: RaiseProject[];
  onUpdate: () => void;
}

export function RaiseTable({ raises, onUpdate }: RaiseTableProps) {
  const [selectedRaises, setSelectedRaises] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [selectedRaise, setSelectedRaise] = useState<RaiseProject | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      // Delete from both tables to maintain consistency
      const { error: raiseError } = await supabase
        .from('raises')
        .delete()
        .eq('id', id);

      if (raiseError) throw raiseError;

      const { error: raiseEquityError } = await supabase
        .from('raise_equity')
        .delete()
        .eq('id', id);

      if (raiseEquityError) throw raiseEquityError;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      onUpdate();
      setSelectedRaises(prev => prev.filter(raiseId => raiseId !== id));
    } catch (error: any) {
      console.error('Error deleting raise:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Delete from both tables to maintain consistency
      const { error: raisesError } = await supabase
        .from('raises')
        .delete()
        .in('id', selectedRaises);

      if (raisesError) throw raisesError;

      const { error: raiseEquityError } = await supabase
        .from('raise_equity')
        .delete()
        .in('id', selectedRaises);

      if (raiseEquityError) throw raiseEquityError;

      toast({
        title: "Success",
        description: `${selectedRaises.length} projects deleted successfully`,
      });

      onUpdate();
      setSelectedRaises([]);
    } catch (error: any) {
      console.error('Error bulk deleting raises:', error);
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
        <BulkActions 
          selectedCount={selectedRaises.length}
          onBulkDelete={handleBulkDelete}
        />
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
              <RaiseTableRow
                key={raise.id}
                raise={raise}
                isSelected={selectedRaises.includes(raise.id)}
                onSelect={(checked) => handleSelectRaise(raise.id, checked)}
                onDelete={() => handleDelete(raise.id)}
                onView={() => {
                  setSelectedRaise(raise);
                  setViewDialogOpen(true);
                }}
                onEdit={() => {
                  setSelectedRaise(raise);
                  setEditDialogOpen(true);
                }}
                onMemo={() => {
                  setSelectedRaise(raise);
                  setMemoDialogOpen(true);
                }}
              />
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
          <EditRaiseDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            project={selectedRaise}
            readOnly
          />
          <MemoDialog
            open={memoDialogOpen}
            onOpenChange={setMemoDialogOpen}
            projectName={selectedRaise.name}
            memo={selectedRaise.memo}
          />
        </>
      )}
    </div>
  );
}