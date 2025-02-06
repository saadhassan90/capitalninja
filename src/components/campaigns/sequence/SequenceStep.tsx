import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Zap } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const variables = [
  { label: 'First Name', value: '{firstName}' },
  { label: 'Last Name', value: '{lastName}' },
  { label: 'Company Name', value: '{companyName}' },
  { label: 'Title', value: '{title}' },
  { label: 'Location', value: '{location}' },
  { label: 'Email', value: '{email}' },
];

export function SequenceStep({ step, useAI, onUpdate }: SequenceStepProps) {
  const subjectInputRef = useRef<HTMLInputElement>(null);

  const handleSubjectVariableInsert = (variable: string) => {
    const input = subjectInputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;

    const newValue = 
      currentValue.substring(0, start) + 
      variable + 
      currentValue.substring(end);

    onUpdate(step.id, "subject", newValue);

    setTimeout(() => {
      input.focus();
      const newPosition = start + variable.length;
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

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
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                ref={subjectInputRef}
                placeholder="Email subject"
                value={step.subject}
                onChange={(e) => onUpdate(step.id, "subject", e.target.value)}
                className="w-full"
                disabled={useAI}
              />
            </div>
            {!useAI && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Variables</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {variables.map((variable) => (
                    <DropdownMenuItem 
                      key={variable.value}
                      onClick={() => handleSubjectVariableInsert(variable.value)}
                    >
                      {variable.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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