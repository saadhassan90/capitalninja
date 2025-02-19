
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
      <TableCell className="flex flex-wrap gap-1">
        {investor.preferred_fund_type?.split(',').map((type, index) => {
          const style = getAssetClassStyle(type.toLowerCase().trim());
          return (
            <span
              key={index}
              className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-xs"
              style={style}
            >
              {type.trim()}
            </span>
          );
        })}
      </TableCell>
      <TableCell className="text-sm">
        {investor.primary_contact && (
          <div>
            <div>{investor.primary_contact}</div>
            {investor.primary_contact_title && (
              <div className="text-xs text-gray-500">{investor.primary_contact_title}</div>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewInvestor(investor.id)}
            className="transition-colors hover:bg-black hover:text-white"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {campaign && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDraftDialog(true)}
              className="transition-colors hover:bg-black hover:text-white"
            >
              <FileEdit className="h-4 w-4 mr-1" />
              Personalize Email
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
