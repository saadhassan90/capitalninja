import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memo: string;
  projectName: string;
  onDownload: () => void;
}

export function MemoDialog({ open, onOpenChange, memo, projectName, onDownload }: MemoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{projectName} - Deal Memo</span>
            <Button variant="outline" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4" id="memo-content">
          <div className="prose max-w-none">
            {memo ? (
              <div className="whitespace-pre-wrap">{memo}</div>
            ) : (
              <p className="text-muted-foreground">No memo available yet. Please wait while we generate it from your pitch deck.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}