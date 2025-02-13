
export type InvestorContact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedin_url: string | null;
  company_id: number;
  is_primary_contact: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  company_name?: string;
};
