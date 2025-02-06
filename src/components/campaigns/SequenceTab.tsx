import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Copy, Eye, Save, Sparkle } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Switch } from "@/components/ui/switch";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

const RichTextEditor = ({ content, onChange }: { content: string; onChange: (html: string) => void }) => {
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
        >
          Bold
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          Italic
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          Bullet List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          Numbered List
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export function SequenceTab() {
  const [steps, setSteps] = useState<EmailStep[]>([
    { id: 1, subject: "", content: "", delay: 5 }
  ]);
  const [useAI, setUseAI] = useState(false);

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

  const addVariant = (stepId: number) => {
    // Implementation for adding variants will go here
    console.log("Adding variant for step", stepId);
  };

  const updateStep = (id: number, field: keyof EmailStep, value: string | number) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Email Sequence</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#1EAEDB] to-[#8B5CF6] p-2 rounded-lg">
            <Switch
              checked={useAI}
              onCheckedChange={setUseAI}
              id="ai-mode"
              className="data-[state=checked]:bg-white"
            />
            <label
              htmlFor="ai-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-white"
            >
              Personalize using AI
              <Sparkle className="h-4 w-4 text-white animate-pulse" />
            </label>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Sequence
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="relative">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Step {step.id}</h3>
                <Button variant="ghost" size="sm" onClick={() => addVariant(step.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Add variant
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Email subject"
                    value={step.subject}
                    onChange={(e) => updateStep(step.id, "subject", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <RichTextEditor
                    content={step.content}
                    onChange={(html) => updateStep(step.id, "content", html)}
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
                  />
                  <span className="text-sm text-muted-foreground">Days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {steps.length < 5 && (
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
    </div>
  );
}