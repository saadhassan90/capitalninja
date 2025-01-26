import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InvestorData = {
  limited_partner_type: string | null;
  aum: number | null;
  year_founded: number | null;
  hqlocation: string | null;
  hqemail: string | null;
  hqphone: string | null;
  description: string | null;
  preferred_fund_type: string | null;
  preferred_commitment_size_min: number | null;
  preferred_commitment_size_max: number | null;
  open_to_first_time_funds: string | null;
};

export function OverviewTab({ investor }: { investor: InvestorData }) {
  return (
    <div className="h-[600px] overflow-y-auto space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Type:</span> {investor?.limited_partner_type || 'N/A'}
            </div>
            <div>
              <span className="font-medium">AUM:</span> {investor?.aum ? `$${(investor.aum / 1e9).toFixed(1)}B` : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Year Founded:</span> {investor?.year_founded || 'N/A'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
          <CardTitle>Investment Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Preferred Fund Type:</span> {investor?.preferred_fund_type || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Min Commitment:</span> {
              investor?.preferred_commitment_size_min 
                ? `$${(investor.preferred_commitment_size_min / 1e6).toFixed(0)}M` 
                : 'N/A'
            }
          </div>
          <div>
            <span className="font-medium">Max Commitment:</span> {
              investor?.preferred_commitment_size_max 
                ? `$${(investor.preferred_commitment_size_max / 1e6).toFixed(0)}M` 
                : 'N/A'
            }
          </div>
          <div>
            <span className="font-medium">Open to First-Time Funds:</span> {investor?.open_to_first_time_funds || 'N/A'}
          </div>
        </CardContent>
      </Card>

      {investor?.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            {investor.description}
          </CardContent>
        </Card>
      )}
    </div>
  );
}