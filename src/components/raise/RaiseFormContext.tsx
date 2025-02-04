import { createContext, useContext, useState } from "react";

interface RaiseFormData {
  type: "equity" | "debt" | "";
  category: "fund_direct_deal" | "startup" | "";
  name: string;
  targetAmount: string;
  assetClass: string;
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
  targetAmount: "",
  assetClass: "",
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