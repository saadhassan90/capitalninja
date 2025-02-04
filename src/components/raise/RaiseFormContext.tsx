import { createContext, useContext, useState } from "react";

export type AssetClassType = 
  | "Real Estate"
  | "Private Equity"
  | "Private Credit"
  | "Energy"
  | "Infrastructure"
  | "Venture Capital"
  | "Startups"
  | "Fund of Funds"
  | "Special Opportunities"
  | "Private Debt"
  | "Natural Resources"
  | "Secondaries"
  | "Co-Investment"
  | "Impact Investing"
  | "Other";

export interface RaiseFormData {
  type: "equity" | "debt" | "";
  category: "fund_direct_deal" | "startup" | "";
  name: string;
  targetAmount: string;
  assetClass: string;
  additional_fees: string;
  asset_classes: AssetClassType[];
  investment_type: string;
  city: string;
  state: string;
  country: string;
  raise_stage: string;
  raise_open_date: Date | null;
  close_date: Date | null;
  first_close: Date | null;
  minimum_ticket_size: string;
  capital_stack: string[];
  gp_capital: string;
  carried_interest: string;
  irr_projections: string;
  equity_multiple: string;
  preferred_returns_hurdle: string;
  asset_management_fee: string;
  asset_management_fees_type: string;
  tax_incentives: string;
  domicile: string;
  strategy: string[];
  economic_drivers: string[];
  risks: string[];
  reups: string;
  audience: string[];
  primary_contact: string;
  contact_email: string;
  company_contact: string;
  raise_description: string;
  banner: string;
  term_lockup: string;
  raise_name: string;
  target_raise: string;
}

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
  raise_open_date: null,
  close_date: null,
  first_close: null,
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