import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';

interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  memo: string;
  onDownload: () => void;
}

export function MemoDialog({ 
  open, 
  onOpenChange, 
  projectName, 
  memo, 
  onDownload 
}: MemoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Deal Memo - {projectName}</DialogTitle>
        </DialogHeader>
        <div id="memo-content" className="prose prose-slate dark:prose-invert max-w-none mt-4 px-4">
          {memo ? (
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 pb-2 border-b">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">{children}</blockquote>
                  ),
                }}
              >
                {memo}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground text-lg">No memo available for this project yet.</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {memo && (
            <Button onClick={onDownload} className="ml-2">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}