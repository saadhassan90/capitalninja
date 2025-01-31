export interface FormData {
  id?: string;
  type: "equity" | "debt" | "";
  category: "fund_direct_deal" | "startup" | "";
  name: string;
  targetAmount: string;
  raisedAmount: string;
  file: File | null;
  pitchDeckUrl?: string;
}

export type MemoStatus = 'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed';

export interface RaiseFormContextType {
  step: number;
  formData: FormData;
  isProcessing: boolean;
  uploadProgress: number;
  memoStatus: MemoStatus;
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