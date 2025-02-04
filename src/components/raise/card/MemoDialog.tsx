import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Edit } from "lucide-react";

interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  memo?: string;
  onGenerate?: () => void;
  onEdit?: () => void;
}

export function MemoDialog({
  open,
  onOpenChange,
  projectName,
  memo,
  onGenerate,
  onEdit,
}: MemoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deal Memo - {projectName}</DialogTitle>
        </DialogHeader>

        {!memo ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Deal Memo Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Generate a comprehensive deal memo using AI. This will analyze your project details
              and create a structured investment memorandum.
            </p>
            <Button onClick={onGenerate}>
              Generate Deal Memo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Memo
              </Button>
            </div>
            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              <div className="prose prose-sm max-w-none">
                {memo}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}