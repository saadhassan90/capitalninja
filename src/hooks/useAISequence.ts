import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailStep {
  id: number;
  subject: string;
  content: string;
  delay: number;
}

export function useAISequence() {
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

      toast({
        title: "AI Sequence Generated",
        description: "Your email sequence has been generated successfully.",
      });

      return aiSequence;
    } catch (error) {
      console.error('Error generating AI sequence:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI sequence. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateAISequence
  };
}