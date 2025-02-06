import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmailPreviewDialog } from "./EmailPreviewDialog";
import { SequenceHeader } from "./sequence/SequenceHeader";
import { SequenceStep } from "./sequence/SequenceStep";
import { supabase } from "@/integrations/supabase/client";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

export function SequenceTab() {
  const [steps, setSteps] = useState<EmailStep[]>([
    { id: 1, subject: "", content: "", delay: 5 }
  ]);
  const [useAI, setUseAI] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAISequence = async (investor: any, raise: any) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email-sequence', {
        body: { investor, raise }
      });

      if (error) throw error;

      const aiSequence = data.map((email: any, index: number) => ({
        id: index + 1,
        subject: email.subject,
        content: email.content,
        delay: 3 + (index * 2)
      }));

      setSteps(aiSequence);
      toast({
        title: "AI Sequence Generated",
        description: "Your email sequence has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating AI sequence:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI sequence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIToggle = async (checked: boolean) => {
    if (checked && steps.some(step => step.subject || step.content)) {
      setShowConfirmDialog(true);
    } else {
      await confirmAIToggle(checked);
    }
  };

  const confirmAIToggle = async (checked: boolean) => {
    setUseAI(checked);
    if (checked) {
      // Fetch investor and raise data here
      const mockInvestor = {
        limited_partner_name: "Sample Investor",
        limited_partner_type: "Private Equity",
        preferred_fund_type: "Growth Equity",
        aum: 1000000000,
        hqlocation: "New York, NY"
      };

      const mockRaise = {
        name: "Growth Fund I",
        target_amount: 50000000,
        type: "equity",
        category: "fund_direct_deal",
        description: "A growth equity fund focused on technology companies"
      };

      await generateAISequence(mockInvestor, mockRaise);
    } else {
      setSteps([{ id: 1, subject: "", content: "", delay: 5 }]);
    }
    setShowConfirmDialog(false);
  };

  const handleSaveSequence = async () => {
    try {
      toast({
        title: "Sequence Saved",
        description: "Your email sequence has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the sequence. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addStep = () => {
    if (steps.length >= 5) return;
    const newStep = {
      id: steps.length + 1,
      subject: "",
      content: "",
      delay: 3
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: number, field: keyof EmailStep, value: string | number) => {
    if (useAI) return;
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <SequenceHeader
        useAI={useAI}
        onAIToggle={handleAIToggle}
        onPreview={() => setShowPreviewDialog(true)}
        onSave={handleSaveSequence}
      />

      {isGenerating ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Generating AI sequence...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step) => (
            <SequenceStep
              key={step.id}
              step={step}
              useAI={useAI}
              onUpdate={updateStep}
            />
          ))}

          {!useAI && steps.length < 5 && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={addStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add step
            </Button>
          )}
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to AI-Generated Sequence?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current email sequence with an AI-generated version. All manually created steps will be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              setUseAI(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmAIToggle(true)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EmailPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        sequence={steps[0]}
      />
    </div>
  );
}