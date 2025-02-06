import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LimitedPartner } from "@/types/investor";
import type { Campaign } from "@/types/campaign";
import { EmailSignature } from "./email-preview/EmailSignature";

interface EmailDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: LimitedPartner;
  campaign: Campaign;
}

export function EmailDraftDialog({
  open,
  onOpenChange,
  investor,
  campaign,
}: EmailDraftDialogProps) {
  // Mock sequence data - in real implementation this would come from the campaign
  const sequence = [
    {
      id: 1,
      title: "Initial Outreach",
      subject: campaign.subject,
      content: campaign.content,
      delay: 0,
    },
    {
      id: 2,
      title: "Follow-up",
      subject: "Re: " + campaign.subject,
      content: "I wanted to follow up on my previous email...",
      delay: 3,
    },
    {
      id: 3,
      title: "Final Follow-up",
      subject: "Re: " + campaign.subject,
      content: "I'm reaching out one last time...",
      delay: 7,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Email Sequence Draft for {investor.limited_partner_name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] p-4">
          <div className="space-y-6">
            {sequence.map((email) => (
              <Card key={email.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {email.title}
                    {email.delay > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Sent after {email.delay} days)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Subject</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">{email.subject}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Email Content</h3>
                    <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                      {email.content}
                    </div>
                  </div>
                  <EmailSignature 
                    senderName="Elle Buetow"
                    senderEmail="elleb@hassanfamilyoffice.com"
                  />
                </CardContent>
              </Card>
            ))}
            <div className="text-sm text-muted-foreground">
              <p>Note: This is a preview of the email sequence. In the future, this content will be personalized for {investor.limited_partner_name} using AI.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}