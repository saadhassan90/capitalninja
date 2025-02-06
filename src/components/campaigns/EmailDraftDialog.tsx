import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { LimitedPartner } from "@/types/investor";
import type { Campaign } from "@/types/campaign";
import { EmailSignature } from "./email-preview/EmailSignature";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: LimitedPartner;
  campaign: Campaign;
}

interface EmailSequence {
  id: number;
  title: string;
  subject: string;
  content: string;
  delay: number;
}

export function EmailDraftDialog({
  open,
  onOpenChange,
  investor,
  campaign,
}: EmailDraftDialogProps) {
  const [sequence, setSequence] = useState<EmailSequence[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSequence = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email-sequence', {
        body: { investor, campaign }
      });

      if (error) throw error;

      const generatedSequence = data.map((email: any, index: number) => ({
        id: index + 1,
        ...email
      }));

      setSequence(generatedSequence);
      toast({
        title: "Email Sequence Generated",
        description: "Your personalized email sequence has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating sequence:', error);
      toast({
        title: "Error",
        description: "Failed to generate email sequence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (open && !sequence.length && !isGenerating) {
      generateSequence();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Email Sequence Draft for {investor.limited_partner_name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] p-4">
          <div className="space-y-6">
            {isGenerating ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Generating personalized sequence...</span>
              </div>
            ) : sequence.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Failed to generate sequence. Please try again.</p>
                <Button 
                  variant="outline" 
                  onClick={generateSequence}
                  className="mt-4"
                  disabled={isGenerating}
                >
                  Regenerate Sequence
                </Button>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Note: This is an AI-generated email sequence personalized for {investor.limited_partner_name}. You can review and edit these emails in the sequence tab.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}