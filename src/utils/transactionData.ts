import { supabase } from "@/integrations/supabase/client";

export interface TransactionData {
  date: string;
  directInvestments: number;
  fundCommitments: number;
  total: number;
}

export const fetchTransactionData = async () => {
  // Fetch direct investments
  const { data: directInvestments } = await supabase
    .from('direct_investments')
    .select('deal_date, deal_size')
    .not('deal_date', 'is', null)
    .order('deal_date');

  // Log the raw direct investments data
  console.log('Raw Direct Investments:', directInvestments);

  // Fetch fund commitments
  const { data: fundCommitments } = await supabase
    .from('fund_commitments')
    .select('commitment_date, commitment')
    .not('commitment_date', 'is', null)
    .order('commitment_date');

  // Log the raw fund commitments data
  console.log('Raw Fund Commitments:', fundCommitments);

  // Combine and process the data
  const transactionsByDate = new Map<string, TransactionData>();

  directInvestments?.forEach(investment => {
    if (!investment.deal_date) return;
    const date = investment.deal_date;
    const existing = transactionsByDate.get(date) || {
      date,
      directInvestments: 0,
      fundCommitments: 0,
      total: 0
    };
    existing.directInvestments += investment.deal_size || 0;
    existing.total = existing.directInvestments + existing.fundCommitments;
    transactionsByDate.set(date, existing);
  });

  fundCommitments?.forEach(commitment => {
    if (!commitment.commitment_date) return;
    const date = commitment.commitment_date;
    const existing = transactionsByDate.get(date) || {
      date,
      directInvestments: 0,
      fundCommitments: 0,
      total: 0
    };
    existing.fundCommitments += commitment.commitment || 0;
    existing.total = existing.directInvestments + existing.fundCommitments;
    transactionsByDate.set(date, existing);
  });

  const sortedData = Array.from(transactionsByDate.values())
    .sort((a, b) => a.date.localeCompare(b.date));

  // Log the processed data
  console.log('Processed Data:', sortedData);
  console.log('Most recent transaction date:', sortedData[sortedData.length - 1]?.date);

  return sortedData;
};