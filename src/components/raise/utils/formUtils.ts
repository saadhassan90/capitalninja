import { FormData } from "../types/formTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const validateStep = (step: number, formData: FormData): boolean => {
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

export const processFile = async (
  file: File,
  userId: string,
  setUploadProgress: (progress: number) => void,
  setMemoStatus: (status: MemoStatus) => void
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('pitch_decks')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  setUploadProgress(40);
  setMemoStatus('analyzing');

  const { data: { publicUrl } } = supabase.storage
    .from('pitch_decks')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const handleRaiseUpload = async (
  formData: FormData,
  userId: string
): Promise<void> => {
  if (!formData.type || !formData.category) {
    throw new Error('Invalid form data');
  }

  const raiseData = {
    type: formData.type,
    category: formData.category,
    name: formData.name,
    target_amount: parseInt(formData.targetAmount),
    user_id: userId,
  };

  const { error } = await supabase
    .from('raises')
    .insert(raiseData);

  if (error) throw error;
};