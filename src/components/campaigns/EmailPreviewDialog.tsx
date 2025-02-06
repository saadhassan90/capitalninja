import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreviewVariablesForm } from "./email-preview/PreviewVariablesForm";
import { TestEmailRecipients } from "./email-preview/TestEmailRecipients";
import { EmailSignature } from "./email-preview/EmailSignature";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sequence: EmailStep[];
  senderName?: string;
  senderEmail?: string;
}

export function EmailPreviewDialog({
  open,
  onOpenChange,
  sequence,
  senderName = "Elle Buetow",
  senderEmail = "elleb@hassanfamilyoffice.com",
}: EmailPreviewDialogProps) {
  const [previewVars, setPreviewVars] = useState({
    senderEmail,
    senderName,
    recipientFirstName: "Christopher",
  });

  const [testEmails, setTestEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{firstName\}/g, previewVars.recipientFirstName)
      .replace(/\{senderName\}/g, previewVars.senderName)
      .replace(/\{senderEmail\}/g, previewVars.senderEmail);
  };

  const handleAddEmail = (email: string) => {
    if (email && testEmails.length < 5 && !testEmails.includes(email)) {
      setTestEmails([...testEmails, email]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setTestEmails(testEmails.filter(email => email !== emailToRemove));
  };

  const handleVariableChange = (field: string, value: string) => {
    setPreviewVars(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Test Email Sequence</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-[300px_1fr] gap-6">
          {/* Left Side - Test Email Controls */}
          <div className="space-y-6 border-r pr-6">
            <PreviewVariablesForm 
              {...previewVars}
              onVariableChange={handleVariableChange}
            />
          </div>

          {/* Right Side - Email Preview */}
          <div className="space-y-6">
            <TestEmailRecipients 
              testEmails={testEmails}
              newEmail={newEmail}
              onNewEmailChange={setNewEmail}
              onAddEmail={handleAddEmail}
              onRemoveEmail={handleRemoveEmail}
            />

            <Tabs defaultValue="1" className="w-full">
              <TabsList className="w-full">
                {sequence.map((email) => (
                  <TabsTrigger key={email.id} value={email.id.toString()} className="flex-1">
                    Email {email.id}
                    {email.delay > 0 && <span className="ml-2 text-xs text-muted-foreground">
                      (+{email.delay} days)
                    </span>}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sequence.map((email) => (
                <TabsContent key={email.id} value={email.id.toString()} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-24">Subject:</span>
                      <span className="text-sm">{replaceVariables(email.subject)}</span>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                      <div 
                        className="prose prose-sm max-w-none" 
                        dangerouslySetInnerHTML={{ __html: replaceVariables(email.content) }} 
                      />
                      
                      <EmailSignature 
                        senderName={previewVars.senderName}
                        senderEmail={previewVars.senderEmail}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}