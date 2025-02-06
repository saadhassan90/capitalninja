import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

interface SequenceStepProps {
  step: EmailStep;
  useAI: boolean;
  onUpdate: (id: number, field: keyof EmailStep, value: string | number) => void;
}

export function SequenceStep({ step, useAI, onUpdate }: SequenceStepProps) {
  return (
    <Card>
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
              onChange={(e) => onUpdate(step.id, "subject", e.target.value)}
              className="w-full"
              disabled={useAI}
            />
          </div>

          <div>
            <RichTextEditor
              content={step.content}
              onChange={(html) => onUpdate(step.id, "content", html)}
              disabled={useAI}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Send next message in</span>
            <Input
              type="number"
              value={step.delay}
              onChange={(e) => onUpdate(step.id, "delay", parseInt(e.target.value))}
              className="w-20"
              min={1}
              disabled={useAI}
            />
            <span className="text-sm text-muted-foreground">Days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}