import { createContext, useContext, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormData, RaiseFormContextType, MemoStatus } from "./types/formTypes";
import { validateStep } from "./utils/formUtils";
import type { RaiseProject } from "./types";

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
  const [memoStatus, setMemoStatus] = useState<MemoStatus>('idle');
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

      const { data: { publicUrl } } = supabase.storage
        .from('pitch_decks')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setMemoStatus('complete');
      toast.success("File uploaded successfully");

      // Store the URL for later use
      updateFormData({ pitchDeckUrl: publicUrl });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setMemoStatus('failed');
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (!user) return;

    if (!formData.name || !formData.targetAmount || !formData.type || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('raises')
        .insert({
          user_id: user.id,
          type: formData.type,
          category: formData.category,
          name: formData.name,
          target_amount: parseInt(formData.targetAmount),
          pitch_deck_url: formData.pitchDeckUrl,
        });

      if (error) throw error;

      toast.success("Raise created successfully");
      onCreateRaise?.();
      handleClose();
    } catch (error: any) {
      console.error('Error in handleUpload:', error);
      toast.error(error.message || "Failed to save raise");
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepValid = () => validateStep(step, formData);

  const handleNext = () => {
    if (isStepValid() && step < 3) {
      setStep(step + 1);
    } else if (!isStepValid()) {
      toast.error(step === 1 ? "Please select a raise type" : "Please select a category");
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