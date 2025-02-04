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

export type RaiseType = "equity" | "debt";
export type RaiseCategory = "fund_direct_deal" | "startup";

export interface RaiseFormData {
  type: RaiseType | "";
  category: RaiseCategory | "";
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
  file: File | null;
  memo: string | null;
}