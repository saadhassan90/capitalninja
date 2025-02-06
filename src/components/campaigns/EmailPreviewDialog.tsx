import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send } from "lucide-react";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sequence: {
    subject: string;
    content: string;
  };
  recipientEmail?: string;
  senderName?: string;
  senderEmail?: string;
}

export function EmailPreviewDialog({
  open,
  onOpenChange,
  sequence,
  recipientEmail = "elleb@hassanfamilyoffice.com",
  senderName = "Elle Buetow",
  senderEmail = "elleb@hassanfamilyoffice.com",
}: EmailPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Email Preview</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-24">Send to:</span>
              <div className="flex-1 flex items-center gap-1">
                <div className="bg-muted text-sm px-2 py-1 rounded-md flex items-center gap-1">
                  {recipientEmail}
                  <X className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
                <Input 
                  placeholder="Enter email address" 
                  className="flex-1 text-sm h-8"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-24">Subject:</span>
              <span className="text-sm">{sequence.subject}</span>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 space-y-6">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sequence.content }} />
            
            <div className="border-t pt-4 space-y-1 text-sm">
              <div>Best,</div>
              <div className="font-medium">{senderName}</div>
              <div>Managing Director | Nvestiv</div>
              <div>E: {senderEmail}</div>
              <div>P: 1-888-831-9886</div>
              <div className="space-x-2 text-blue-500">
                <a href="#" className="hover:underline">Linkedin</a>
                <a href="#" className="hover:underline">Website</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Check Deliverability Score
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send test email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}