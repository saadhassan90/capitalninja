export interface RaiseProject {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  created_at: string;
  status: string;
  memo?: string;
  type: string;
  category: string;
  pitch_deck_url?: string;
}

export interface RaiseCardProps {
  project: RaiseProject;
  onDelete?: () => void;
}

export interface FormData {
  raise_name: string;
  raise_description: string;
  target_raise: string;
  primary_contact: string;
  contact_email: string;
}

export interface RaiseFormContextType {
  step: number;
  formData: FormData;
  isProcessing: boolean;
  uploadProgress: number;
  memoStatus: 'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed';
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  handleUpload: () => Promise<void>;
  handleProcess: () => Promise<void>;
  handleNext: () => void;
  handleBack: () => void;
  handleClose: () => void;
  handleExitConfirm: () => void;
  isStepValid: () => boolean;
}