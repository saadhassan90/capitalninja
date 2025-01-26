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
  primary_contact: string | null;
  primary_contact_title: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  website: string | null;
};

export function OverviewTab({ investor }: { investor: InvestorData }) {
  return (
    <div className="h-[600px] overflow-y-auto space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Type:</span> {investor?.limited_partner_type || 'N/A'}
            </div>
            <div>
              <span className="font-medium">AUM (USD M):</span> {investor?.aum ? `${(investor.aum / 1e6).toFixed(0)}` : 'N/A'}
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
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
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
          <CardTitle className="text-sm font-medium">Primary Contact</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Investment Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Preferred Fund Type:</span> {investor?.preferred_fund_type || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Min Commitment (USD M):</span> {
              investor?.preferred_commitment_size_min 
                ? `${(investor.preferred_commitment_size_min / 1e6).toFixed(0)}` 
                : 'N/A'
            }
          </div>
          <div>
            <span className="font-medium">Max Commitment (USD M):</span> {
              investor?.preferred_commitment_size_max 
                ? `${(investor.preferred_commitment_size_max / 1e6).toFixed(0)}` 
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
            <CardTitle className="text-sm font-medium">Description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {investor.description}
          </CardContent>
        </Card>
      )}
    </div>
  );
}