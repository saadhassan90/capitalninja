import { createContext, useContext, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FormData, RaiseFormContextType, RaiseProject } from "./types";

const RaiseFormContext = createContext<RaiseFormContextType>({} as RaiseFormContextType);

interface RaiseFormProviderProps {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  onCreateRaise?: () => void;
  editMode?: boolean;
  project?: RaiseProject;
}

export function RaiseFormProvider({ 
  children, 
  onOpenChange, 
  onCreateRaise,
  editMode,
  project 
}: RaiseFormProviderProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [memoStatus, setMemoStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed'>('idle');
  const [formData, setFormData] = useState<FormData>(() => {
    if (editMode && project) {
      return {
        id: project.id,
        type: project.type as "equity" | "debt" | "",
        category: project.category as "fund_direct_deal" | "startup" | "",
        name: project.name,
        targetAmount: project.target_amount.toString(),
        raisedAmount: "",
        file: null,
      };
    }
    return {
      type: "",
      category: "",
      name: "",
      targetAmount: "",
      raisedAmount: "",
      file: null,
    };
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleProcess = async () => {
    if (!formData.file || !user) return;

    setIsProcessing(true);
    setMemoStatus('extracting');
    setUploadProgress(20);

    try {
      const fileExt = formData.file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('pitch_decks')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      setUploadProgress(40);
      setMemoStatus('analyzing');

      const { data: { publicUrl } } = supabase.storage
        .from('pitch_decks')
        .getPublicUrl(filePath);

      setUploadProgress(60);
      setMemoStatus('creating');

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/functions/v1/process-pitch-deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          fileUrl: publicUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process pitch deck');
      }

      setUploadProgress(100);
      setMemoStatus('complete');
      toast.success("Pitch deck processed successfully");
    } catch (error: any) {
      console.error('Error processing pitch deck:', error);
      setMemoStatus('failed');
      toast.error(error.message || "Failed to process pitch deck");
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.category;
      case 3:
        return !!formData.name && !!formData.targetAmount && !!formData.file;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      if (step === 1) {
        toast.error("Please select a raise type");
      } else if (step === 2) {
        toast.error("Please select a category");
      }
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setFormData({
      type: "",
      category: "",
      name: "",
      targetAmount: "",
      raisedAmount: "",
      file: null,
    });
    setIsProcessing(false);
    setUploadProgress(0);
  };

  const handleExitConfirm = () => {
    handleClose();
  };

  const handleUpload = async () => {
    if (!user) return;

    if (!formData.name) {
      toast.error("Please enter a raise name");
      return;
    }

    if (!formData.targetAmount) {
      toast.error("Please enter a target amount");
      return;
    }

    if (!formData.type || !formData.category) {
      toast.error("Type and category are required");
      return;
    }

    if (memoStatus !== 'complete') {
      toast.error("Please process the pitch deck first");
      return;
    }

    setIsProcessing(true);

    try {
      const raiseData = {
        type: formData.type,
        category: formData.category,
        name: formData.name,
        target_amount: parseInt(formData.targetAmount),
        user_id: user.id,
      };

      let error;
      
      if (editMode && formData.id) {
        const { error: updateError } = await supabase
          .from('raises')
          .update(raiseData)
          .eq('id', formData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('raises')
          .insert(raiseData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(editMode ? "Raise updated successfully" : "Raise created successfully");
      onCreateRaise?.();
      handleClose();
    } catch (error: any) {
      console.error('Error in handleUpload:', error);
      toast.error(error.message || "Failed to save raise");
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    step,
    formData,
    isProcessing,
    uploadProgress,
    memoStatus,
    setStep,
    updateFormData,
    handleUpload,
    handleProcess,
    handleNext,
    handleBack,
    handleClose,
    handleExitConfirm,
    isStepValid,
  };

  return (
    <RaiseFormContext.Provider value={value}>
      {children}
    </RaiseFormContext.Provider>
  );
}

export const useRaiseForm = () => {
  const context = useContext(RaiseFormContext);
  if (context === undefined) {
    throw new Error('useRaiseForm must be used within a RaiseFormProvider');
  }
  return context;
};
