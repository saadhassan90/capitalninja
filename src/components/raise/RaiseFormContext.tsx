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

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      console.log('Starting upload process...');
      let pitchDeckUrl = project?.pitch_deck_url;

      if (formData.file) {
        console.log('Uploading pitch deck file...');
        const fileExt = formData.file.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('pitch_decks')
          .upload(filePath, formData.file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('File uploaded successfully, getting public URL...');
        const { data: { publicUrl } } = supabase.storage
          .from('pitch_decks')
          .getPublicUrl(filePath);

        pitchDeckUrl = publicUrl;
        console.log('Public URL obtained:', pitchDeckUrl);
      }

      if (!formData.type || !formData.category) {
        throw new Error("Type and category are required");
      }

      const raiseData = {
        type: formData.type,
        category: formData.category,
        name: formData.name,
        target_amount: parseInt(formData.targetAmount),
        pitch_deck_url: pitchDeckUrl,
        user_id: user.id
      };

      console.log('Saving raise data to database...');
      let error;
      let raiseId;
      
      if (editMode && formData.id) {
        const { error: updateError } = await supabase
          .from('raises')
          .update(raiseData)
          .eq('id', formData.id);
        error = updateError;
        raiseId = formData.id;
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from('raises')
          .insert(raiseData)
          .select()
          .single();
        error = insertError;
        raiseId = insertData?.id;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Process the pitch deck with OpenAI if a file was uploaded
      if (formData.file && pitchDeckUrl && raiseId) {
        console.log('Calling process-pitch-deck function...');
        const response = await fetch('/functions/v1/process-pitch-deck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            raiseId,
            fileUrl: pitchDeckUrl,
          }),
        });

        if (!response.ok) {
          console.error('Error processing pitch deck:', await response.text());
          toast.error('Failed to process pitch deck');
        } else {
          console.log('Pitch deck processed successfully');
        }
      }

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
    setStep,
    updateFormData,
    handleUpload,
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