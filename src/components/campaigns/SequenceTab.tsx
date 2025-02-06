import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Copy, Eye, Save } from "lucide-react";

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
        <div className="flex gap-2">
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
                  <Textarea
                    placeholder="Email content"
                    value={step.content}
                    onChange={(e) => updateStep(step.id, "content", e.target.value)}
                    className="min-h-[200px]"
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