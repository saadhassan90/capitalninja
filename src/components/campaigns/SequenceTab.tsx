import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Copy, Eye, Save, Sparkle } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

const RichTextEditor = ({ content, onChange, disabled }: { content: string; onChange: (html: string) => void; disabled?: boolean }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[150px]',
      },
    },
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <div className="border-b bg-muted/50 p-2 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Bold
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Italic
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Bullet List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Numbered List
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const aiGeneratedSequence: EmailStep[] = [
  {
    id: 1,
    subject: "Exclusive Pre-Sale option for you Christopher",
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
      setSteps(aiGeneratedSequence);
      toast({
        title: "AI Sequence Generated",
        description: "Your email sequence has been replaced with an AI-generated version.",
      });
    } else {
      setSteps([{ id: 1, subject: "", content: "", delay: 5 }]);
    }
    setShowConfirmDialog(false);
    setPendingAIToggle(false);
  };

  const handleSaveSequence = async () => {
    try {
      // Here you would typically save to your backend
      // For now, we'll just show a success toast
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Email Sequence</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={useAI}
              onCheckedChange={handleAIToggle}
              id="ai-mode"
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#1EAEDB] data-[state=checked]:to-[#8B5CF6]"
            />
            <label
              htmlFor="ai-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <span className="bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] bg-clip-text text-transparent">
                Personalize using AI
              </span>
              <Sparkle className="h-4 w-4 text-[#1EAEDB]" />
            </label>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowPreviewDialog(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSaveSequence}>
            <Save className="h-4 w-4 mr-2" />
            Save Sequence
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <Card key={step.id} className="relative">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Step {step.id}</h3>
                {!useAI && (
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    <Copy className="h-4 w-4 mr-2" />
                    Add variant
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Email subject"
                    value={step.subject}
                    onChange={(e) => updateStep(step.id, "subject", e.target.value)}
                    className="w-full"
                    disabled={useAI}
                  />
                </div>

                <div>
                  <RichTextEditor
                    content={step.content}
                    onChange={(html) => updateStep(step.id, "content", html)}
                    disabled={useAI}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Send next message in</span>
                  <Input
                    type="number"
                    value={step.delay}
                    onChange={(e) => updateStep(step.id, "delay", parseInt(e.target.value))}
                    className="w-20"
                    min={1}
                    disabled={useAI}
                  />
                  <span className="text-sm text-muted-foreground">Days</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
