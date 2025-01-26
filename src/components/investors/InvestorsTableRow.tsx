import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { getAssetClassStyle } from "@/utils/assetClassColors";

type LimitedPartner = {
  id: number;
  limited_partner_name: string;
  limited_partner_type: string | null;
  aum: number | null;
  hqlocation: string | null;
  preferred_fund_type: string | null;
  preferred_commitment_size_min: number | null;
};

interface InvestorsTableRowProps {
  investor: LimitedPartner;
  onViewInvestor: (id: number) => void;
}

export function InvestorsTableRow({ investor, onViewInvestor }: InvestorsTableRowProps) {
  const renderFundTypes = (fundTypes: string | null) => {
    if (!fundTypes) return 'N/A';
    
    type AssetClass = 'privateEquity' | 'realEstate' | 'privateCredit' | 'venture' | 'energy' | 'infrastructure' | 'other';
    
    const mapFundTypeToAssetClass = (type: string): AssetClass => {
      type = type.toLowerCase().trim();
      if (type.includes('private equity') || type.includes('pe')) return 'privateEquity';
      if (type.includes('real estate') || type.includes('re')) return 'realEstate';
      if (type.includes('private credit') || type.includes('debt')) return 'privateCredit';
      if (type.includes('venture') || type.includes('vc')) return 'venture';
      if (type.includes('energy')) return 'energy';
      if (type.includes('infrastructure')) return 'infrastructure';
      return 'other';
    };
    
    return fundTypes.split(',').map((type, index) => {
      const assetClass = mapFundTypeToAssetClass(type);
      const style = getAssetClassStyle(assetClass);
      
      return (
        <span
          key={index}
          className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-xs"
          style={style}
        >
          {type.trim()}
        </span>
      );
    });
  };

  return (
    <TableRow>
      <TableCell className="text-sm font-medium">{investor.limited_partner_name}</TableCell>
      <TableCell className="text-sm">{investor.limited_partner_type || 'N/A'}</TableCell>
      <TableCell className="text-sm">{investor.aum ? `${(investor.aum / 1e6).toFixed(0)}` : 'N/A'}</TableCell>
      <TableCell className="text-sm">{investor.hqlocation || 'N/A'}</TableCell>
      <TableCell className="flex flex-wrap gap-1">{renderFundTypes(investor.preferred_fund_type)}</TableCell>
      <TableCell className="text-sm">
        {investor.preferred_commitment_size_min 
          ? `${(investor.preferred_commitment_size_min / 1e6).toFixed(0)}`
          : 'N/A'}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewInvestor(investor.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}