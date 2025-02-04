import { createContext, useContext, useState } from "react";
import type { RaiseFormData } from "./types/raiseTypes";

const initialFormData: RaiseFormData = {
  type: "",
  category: "",
  name: "",
  targetAmount: "",
  assetClass: "",
  additional_fees: "",
  asset_classes: [],
  investment_type: "",
  city: "",
  state: "",
  country: "",
  raise_stage: "",
  minimum_ticket_size: "",
  capital_stack: [],
  gp_capital: "",
  carried_interest: "",
  irr_projections: "",
  equity_multiple: "",
  preferred_returns_hurdle: "",
  asset_management_fee: "",
  asset_management_fees_type: "",
  tax_incentives: "",
  domicile: "",
  strategy: [],
  economic_drivers: [],
  risks: [],
  reups: "",
  audience: [],
  primary_contact: "",
  contact_email: "",
  company_contact: "",
  raise_description: "",
  banner: "",
  term_lockup: "",
  raise_name: "",
  target_raise: "",
  file: null,
  memo: null,
};

interface RaiseFormContextType {
  formData: RaiseFormData;
  updateFormData: (data: Partial<RaiseFormData>) => void;
  resetForm: () => void;
}

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