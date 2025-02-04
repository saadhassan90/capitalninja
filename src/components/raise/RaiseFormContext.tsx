import { createContext, useContext, useState } from "react";

interface RaiseFormData {
  type: "venture_capital" | "private_equity" | "real_estate" | "debt" | "";
  category: "fund_direct_deal" | "startup" | "";
  name: string;
  description: string;
  target_amount: number | null;
  pitch_deck_url: string | null;
  memo: string | null;
}

interface RaiseFormContextType {
  formData: RaiseFormData;
  updateFormData: (data: Partial<RaiseFormData>) => void;
  resetForm: () => void;
}

const initialFormData: RaiseFormData = {
  type: "",
  category: "",
  name: "",
  description: "",
  target_amount: null,
  pitch_deck_url: null,
  memo: null,
};

const RaiseFormContext = createContext<RaiseFormContextType | undefined>(undefined);

export function RaiseFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<RaiseFormData>(initialFormData);

  const updateFormData = (data: Partial<RaiseFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <RaiseFormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </RaiseFormContext.Provider>
  );
}

export function useRaiseForm() {
  const context = useContext(RaiseFormContext);
  if (context === undefined) {
    throw new Error("useRaiseForm must be used within a RaiseFormProvider");
  }
  return context;
}