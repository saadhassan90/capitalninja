import { ProcessedInvestorData } from "./processedInvestor";

export interface FundCommitment {
  fund_name: string;
  commitment: number;
  commitment_date: string | null;
}

export interface DirectInvestment {
  company_name: string;
  deal_size: number;
  deal_date: string | null;
}

export interface InvestorProfileTabProps {
  investor: ProcessedInvestorData;
}

export interface CommitmentsTabProps extends InvestorProfileTabProps {
  commitments: FundCommitment[];
}

export interface InvestmentsTabProps extends InvestorProfileTabProps {
  investments: DirectInvestment[];
}