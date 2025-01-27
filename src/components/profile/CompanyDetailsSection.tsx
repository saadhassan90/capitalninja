import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyDetailsSectionProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  companyDescription: string;
  setCompanyDescription: (value: string) => void;
  companyWebsite: string;
  setCompanyWebsite: (value: string) => void;
}

export function CompanyDetailsSection({
  companyName,
  setCompanyName,
  companyDescription,
  setCompanyDescription,
  companyWebsite,
  setCompanyWebsite,
}: CompanyDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Company Details</h2>
      
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companyDescription">Company Description</Label>
        <Textarea
          id="companyDescription"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companyWebsite">Company Website</Label>
        <Input
          id="companyWebsite"
          type="url"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
      </div>
    </div>
  );
}