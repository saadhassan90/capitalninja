import { useState } from "react";
import type { LimitedPartner } from "@/types/investor";

export function useInvestorSelection() {
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);

  const handleSelectAll = (investors: LimitedPartner[], checked: boolean) => {
    if (checked) {
      const allIds = investors.map(investor => investor.id);
      setSelectedInvestors(allIds);
    } else {
      setSelectedInvestors([]);
    }
  };

  const handleSelectInvestor = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedInvestors(prev => [...prev, id]);
    } else {
      setSelectedInvestors(prev => prev.filter(investorId => investorId !== id));
    }
  };

  return {
    selectedInvestors,
    setSelectedInvestors,
    handleSelectAll,
    handleSelectInvestor
  };
}