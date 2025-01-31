import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, FileText, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
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
  onMemo: () => void;
}

export function RaiseTableRow({ 
  raise, 
  isSelected, 
  onSelect,
  onDelete,
  onView,
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
            onClick={onView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMemo}
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
                <AlertDialogAction onClick={onDelete}>
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}