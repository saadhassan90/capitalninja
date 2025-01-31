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
  id?: string;
  type: "equity" | "debt" | "";
  category: "fund_direct_deal" | "startup" | "";
  name: string;
  targetAmount: string;
  raisedAmount: string;
  file: File | null;
}

export interface RaiseFormContextType {
  step: number;
  formData: FormData;
  isProcessing: boolean;
  uploadProgress: number;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  handleUpload: () => Promise<void>;
  handleNext: () => void;
  handleBack: () => void;
  handleClose: () => void;
  handleExitConfirm: () => void;
  isStepValid: () => boolean;
}