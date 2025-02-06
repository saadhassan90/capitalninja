import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { FormatToolbar } from "./sequence/FormatToolbar";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

const aiGeneratedSequence: EmailStep[] = [
  {
    id: 1,
    subject: "Exclusive Pre-Sale option for you {firstName}",
    content: `<p>Fund managers and capital raisers like you have two options:</p>
    <p>1️⃣ Pay over $50k/year for databases like Preqin, PitchBook, Fintrx, or ZoomInfo, each offering partial and incomplete data.</p>
    <p>2️⃣ Use CapitalNinja – our AI compiles investor/LP data from all these platforms into harmonized profiles for a fraction of the cost. CapitalNinja is the newest portfolio company of the Hassan Family Office.</p>
    <p>For $2k/month, you'll access harmonized insights previously scattered across platforms, saving time and money. This invite-only pre-sale is for those who've connected with Hassan Family Office in some way. We're capping discounted access at 100 clients. Post-launch, the price rises to $5k/month.</p>
    <p>Let's book a Meeting!</p>`,
    delay: 0
  },
  {
    id: 2,
    subject: "Key Metrics and Market Opportunity",
    content: "<p>Following up on my previous email about our investment opportunity. I wanted to share some key metrics that demonstrate our market position and growth trajectory:</p><ul><li>Market size: $50B+</li><li>Current growth rate: 40% YoY</li><li>Target IRR: 25%+</li></ul><p>When would be a good time for a brief discussion?</p>",
    delay: 3
  },
  {
    id: 3,
    subject: "Final Follow-up and Next Steps",
    content: "<p>I wanted to make one final attempt to connect regarding our investment opportunity. Given your successful track record with similar investments, I believe this could be a mutually beneficial partnership.</p><p>I've attached our detailed pitch deck for your review. Please let me know if you'd like to schedule a call to discuss further.</p>",
    delay: 4
  }
];

export function SequenceTab() {
  const [steps, setSteps] = useState<EmailStep[]>([
    { id: 1, subject: "", content: "", delay: 5 }
  ]);
  const [useAI, setUseAI] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAIToggle, setPendingAIToggle] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const { toast } = useToast();

  const handleAIToggle = (checked: boolean) => {
    if (checked && steps.some(step => step.subject || step.content)) {
      setShowConfirmDialog(true);
      setPendingAIToggle(true);
    } else {
      confirmAIToggle(checked);
    }
  };

  const confirmAIToggle = (checked: boolean) => {
    setUseAI(checked);
    if (checked) {
      // Completely replace with AI sequence
      setSteps(aiGeneratedSequence);
      toast({
        title: "AI Sequence Generated",
        description: "Your email sequence has been replaced with an AI-generated version.",
      });
    } else {
      // Reset to a single empty step when turning AI off
      setSteps([{ id: 1, subject: "", content: "", delay: 5 }]);
    }
    setShowConfirmDialog(false);
    setPendingAIToggle(false);
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

  const handleFormat = (command: string, value?: string) => {
    if (useAI) return;
    
    if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false);
    }
  };

  const handleInsertVariable = (variable: string) => {
    if (useAI) return;
    
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    if (range) {
      const variableSpan = document.createElement('span');
      variableSpan.className = 'bg-blue-100 px-1 rounded';
      variableSpan.textContent = variable;
      range.deleteContents();
      range.insertNode(variableSpan);
    }
  };

  const handleInsertLink = (url: string) => {
    if (useAI) return;
    
    document.execCommand('createLink', false, url);
  };

  return (
    <div className="space-y-6 p-6">
      <SequenceHeader
        useAI={useAI}
        onAIToggle={handleAIToggle}
        onPreview={() => setShowPreviewDialog(true)}
        onSave={handleSaveSequence}
      />

      <div className="space-y-4">
        <FormatToolbar 
          onFormat={handleFormat}
          onInsertVariable={handleInsertVariable}
          onInsertLink={handleInsertLink}
        />

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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to AI-Generated Sequence?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current email sequence with an AI-generated version. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              setPendingAIToggle(false);
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