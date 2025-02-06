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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail(newEmail);
    }
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

          {/* Right Side - Email Preview */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-24">Send to:</span>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {testEmails.map((email) => (
                      <div key={email} className="bg-muted text-sm px-2 py-1 rounded-md flex items-center gap-1">
                        {email}
                        <X 
                          className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground" 
                          onClick={() => handleRemoveEmail(email)}
                        />
                      </div>
                    ))}
                  </div>
                  {testEmails.length < 5 && (
                    <Input 
                      placeholder="Enter email address and press Enter" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-sm h-8"
                    />
                  )}
                </div>
              </div>
            </div>

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