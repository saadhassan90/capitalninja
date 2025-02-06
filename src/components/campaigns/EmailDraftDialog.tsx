import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LimitedPartner } from "@/types/investor";
import type { Campaign } from "@/types/campaign";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email Sequence Draft for {investor.limited_partner_name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Subject</h3>
              <p className="text-sm bg-muted p-3 rounded-md">{campaign.subject}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Email Content</h3>
              <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                {campaign.content}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Note: This is a preview of the email sequence. In the future, this content will be personalized for {investor.limited_partner_name} using AI.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}