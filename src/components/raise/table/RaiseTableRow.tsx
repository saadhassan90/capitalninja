import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Eye, Trash2, Edit, StickyNote } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { RaiseProject } from "../types";

interface RaiseTableRowProps {
  raise: RaiseProject;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: () => void;
  onView: () => void;
  onEdit: () => void;
  onMemo: () => void;
}

export function RaiseTableRow({ 
  raise, 
  isSelected, 
  onSelect,
  onDelete,
  onView,
  onEdit,
  onMemo
}: RaiseTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell className="font-medium">{raise.name}</TableCell>
      <TableCell>{raise.type}</TableCell>
      <TableCell>{raise.target_amount ? formatCurrency(raise.target_amount) : 'N/A'}</TableCell>
      <TableCell>{new Date(raise.created_at).toLocaleDateString()}</TableCell>
      <TableCell className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onMemo}
          className="gap-2"
        >
          <StickyNote className="h-4 w-4" />
          Memo
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
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
                  <AlertDialogAction onClick={onDelete}>
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}