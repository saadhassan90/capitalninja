import { useState } from "react";
import { EmailPreviewDialog } from "./EmailPreviewDialog";
import { SequenceHeader } from "./sequence/SequenceHeader";
import { SequenceStepsList } from "./sequence/SequenceStepsList";
import { ConfirmAIDialog } from "./sequence/ConfirmAIDialog";
import { useAISequence } from "@/hooks/useAISequence";
import { useToast } from "@/hooks/use-toast";

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
  const { isGenerating, generateAISequence } = useAISequence();
  const { toast } = useToast();

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

      const aiSequence = await generateAISequence(mockInvestor, mockRaise);
      if (aiSequence) {
        setSteps(aiSequence);
      }
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

      <SequenceStepsList
        steps={steps}
        useAI={useAI}
        isGenerating={isGenerating}
        onUpdateStep={updateStep}
        onAddStep={addStep}
      />

      <ConfirmAIDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={() => confirmAIToggle(true)}
        onCancel={() => {
          setShowConfirmDialog(false);
          setUseAI(false);
        }}
      />

      <EmailPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        sequence={steps[0]}
      />
    </div>
  );
}