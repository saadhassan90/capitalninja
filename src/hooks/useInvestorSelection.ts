import { useState } from "react";

export function useInvestorSelection() {
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // This will be handled by the component that has access to the investors array
      setSelectedInvestors([]);
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