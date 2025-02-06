import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, FileEdit } from "lucide-react";
import { getAssetClassStyle } from "@/utils/assetClassColors";
import { EmailDraftDialog } from "@/components/campaigns/EmailDraftDialog";
import type { LimitedPartner } from "@/types/investor";
import type { Campaign } from "@/types/campaign";

interface InvestorsTableRowProps {
  investor: LimitedPartner;
  onViewInvestor: (id: number) => void;
  selected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  listId?: string;
  campaign?: Campaign;
}

export function InvestorsTableRow({ 
  investor, 
  onViewInvestor, 
  selected, 
  onSelect,
  listId,
  campaign
}: InvestorsTableRowProps) {
  const [showDraftDialog, setShowDraftDialog] = useState(false);

  const renderFundTypes = (fundTypes: string | null) => {
    if (!fundTypes) return 'N/A';
    
    const mapFundTypeToAssetClass = (type: string) => {
      type = type.toLowerCase().trim();
      
      if (type.includes('buyout')) return 'buyout';
      if (type.includes('growth') || type.includes('expansion')) return 'growth';
      if (type.includes('real estate')) return 'realEstate';
      if (type.includes('early stage') || type.includes('seed')) return 'earlyStage';
      if (type.includes('late stage')) return 'lateStage';
      if (type.includes('venture') || type.includes('vc')) return 'venture';
      if (type.includes('energy')) return 'energy';
      if (type.includes('infrastructure')) return 'infrastructure';
      if (type.includes('secondaries')) return 'secondaries';
      if (type.includes('fund of funds') || type.includes('fof')) return 'fundOfFunds';
      if (type.includes('distressed')) return 'distressed';
      if (type.includes('mezzanine')) return 'mezzanine';
      if (type.includes('credit') || type.includes('debt')) return 'privateCredit';
      if (type.includes('private equity') || type.includes('pe')) return 'privateEquity';
      
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

  const renderPrimaryContact = () => {
    if (!investor.primary_contact) return 'N/A';
    return (
      <div>
        <div>{investor.primary_contact}</div>
        {investor.primary_contact_title && (
          <div className="text-xs text-gray-500">{investor.primary_contact_title}</div>
        )}
      </div>
    );
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={selected}
          onCheckedChange={(checked) => onSelect(investor.id, checked as boolean)}
          aria-label={`Select ${investor.limited_partner_name}`}
        />
      </TableCell>
      <TableCell className="text-sm font-medium">{investor.limited_partner_name}</TableCell>
      <TableCell className="text-sm">{investor.limited_partner_type || 'N/A'}</TableCell>
      <TableCell className="text-sm">{investor.aum ? `${(investor.aum / 1e6).toFixed(0)}` : 'N/A'}</TableCell>
      <TableCell className="text-sm">{investor.hqlocation || 'N/A'}</TableCell>
      <TableCell className="flex flex-wrap gap-1">{renderFundTypes(investor.preferred_fund_type)}</TableCell>
      <TableCell className="text-sm">{renderPrimaryContact()}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewInvestor(investor.id)}
            className="transition-colors hover:bg-black hover:text-white"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          {campaign && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDraftDialog(true)}
              className="transition-colors hover:bg-black hover:text-white"
            >
              <FileEdit className="h-4 w-4" />
              Draft
            </Button>
          )}
        </div>

        {showDraftDialog && campaign && (
          <EmailDraftDialog
            open={showDraftDialog}
            onOpenChange={setShowDraftDialog}
            investor={investor}
            campaign={campaign}
          />
        )}
      </TableCell>
    </TableRow>
  );
}