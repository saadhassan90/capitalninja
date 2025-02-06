import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Send } from "lucide-react";
import { useState } from "react";

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
  const [previewVars, setPreviewVars] = useState({
    senderEmail,
    senderName,
    recipientFirstName: "Christopher",
  });

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{firstName\}/g, previewVars.recipientFirstName)
      .replace(/\{senderName\}/g, previewVars.senderName)
      .replace(/\{senderEmail\}/g, previewVars.senderEmail);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Email Preview</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-[300px_1fr] gap-6">
          {/* Left Side - Test Email Controls */}
          <div className="space-y-6 border-r pr-6">
            <div>
              <h3 className="font-semibold mb-4">Test Email</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sender Email</Label>
                  <Input 
                    value={previewVars.senderEmail}
                    onChange={(e) => setPreviewVars(prev => ({ ...prev, senderEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sender Full Name</Label>
                  <Input 
                    value={previewVars.senderName}
                    onChange={(e) => setPreviewVars(prev => ({ ...prev, senderName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recipient First Name</Label>
                  <Input 
                    value={previewVars.recipientFirstName}
                    onChange={(e) => setPreviewVars(prev => ({ ...prev, recipientFirstName: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Email Preview */}
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
                <span className="text-sm">{replaceVariables(sequence.subject)}</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div 
                className="prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: replaceVariables(sequence.content) }} 
              />
              
              <div className="border-t pt-4 space-y-1 text-sm">
                <div>Best,</div>
                <div className="font-medium">{previewVars.senderName}</div>
                <div>Managing Director | Nvestiv</div>
                <div>E: {previewVars.senderEmail}</div>
                <div>P: 1-888-831-9886</div>
                <div className="space-x-2 text-blue-500">
                  <a href="#" className="hover:underline">Linkedin</a>
                  <a href="#" className="hover:underline">Website</a>
                </div>
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