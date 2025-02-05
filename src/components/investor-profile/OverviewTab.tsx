import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssetClassStyle } from "@/utils/assetClassColors";
import { ProcessedInvestorData } from "@/types/processedInvestor";

export function OverviewTab({ investor }: { investor: ProcessedInvestorData }) {
  const assetAllocation = [
    { 
      label: "Private Equity",
      value: investor.private_equity_percent,
      assetClass: 'privateEquity' as const
    },
    { 
      label: "Real Estate",
      value: investor.real_estate_percent,
      assetClass: 'realEstate' as const
    },
    {
      label: "Special Opportunities",
      value: investor.special_opportunities_percent,
      assetClass: 'debtFunds' as const
    }
  ].filter(item => item.value !== null);

  return (
    <div className="h-[600px] overflow-y-auto space-y-4 p-4">
      {investor?.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {investor.description}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Type:</span> {investor?.limited_partner_type || 'N/A'}
            </div>
            <div>
              <span className="font-medium">AUM (USD M):</span> {investor?.aum ? `${(Number(investor.aum) / 1e6).toFixed(0)}` : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Year Founded:</span> {investor?.year_founded || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Website:</span> {
                investor?.website ? (
                  <a href={investor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {investor.website}
                  </a>
                ) : 'N/A'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Location:</span> {investor?.hqlocation || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {investor?.hqemail || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {investor?.hqphone || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Primary Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Name:</span> {investor?.primary_contact || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Title:</span> {investor?.primary_contact_title || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Email:</span> {investor?.primary_contact_email || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {investor?.primary_contact_phone || 'N/A'}
          </div>
        </CardContent>
      </Card>

      {assetAllocation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assetAllocation.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span 
                  className="text-xs"
                  style={getAssetClassStyle(item.assetClass)}
                >
                  {item.label}
                </span>
                <span className="text-xs font-medium">
                  {item.value}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Investment Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Preferred Fund Type:</span> {investor?.preferred_fund_type || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Min Commitment (USD M):</span> {
              investor?.preferred_commitment_size_min 
                ? `${(Number(investor.preferred_commitment_size_min) / 1e6).toFixed(0)}` 
                : 'N/A'
            }
          </div>
          <div>
            <span className="font-medium">Max Commitment (USD M):</span> {
              investor?.preferred_commitment_size_max 
                ? `${(Number(investor.preferred_commitment_size_max) / 1e6).toFixed(0)}` 
                : 'N/A'
            }
          </div>
          <div>
            <span className="font-medium">Open to First-Time Funds:</span> {investor?.open_to_first_time_funds || 'N/A'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
