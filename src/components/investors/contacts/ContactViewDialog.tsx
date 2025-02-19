
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Mail, Building, MapPin, BanknoteIcon, Globe, FileText, BarChart3 } from "lucide-react";
import { AddToListDialog } from "@/components/investors/AddToListDialog";
import { useState } from "react";
import type { InvestorContact } from "@/types/investor-contact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContactViewDialogProps {
  contact: InvestorContact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactViewDialog({ contact, open, onOpenChange }: ContactViewDialogProps) {
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);

  if (!contact) return null;

  const formatAUM = (aum: number | null) => {
    if (!aum) return 'N/A';
    return `$${(aum / 1000000000).toFixed(1)}B`;
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Contact Details</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="py-4">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-3">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    <p className="text-muted-foreground">{contact.title || 'No title'}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Company</h4>
                    <p>{contact.company_name}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      {contact.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {contact.email}
                        </p>
                      )}
                      {contact.phone && (
                        <p>{contact.phone}</p>
                      )}
                      {contact.linkedin_url && (
                        <a 
                          href={contact.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>

                  {contact.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-muted-foreground">{contact.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company" className="py-4">
              <div className="grid gap-6">
                {/* Company Overview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Company Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h4>
                        <p className="font-medium">{contact.company_name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                        <p className="font-medium">{contact.companyType || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">AUM</h4>
                        <p className="font-medium">{formatAUM(contact.companyAUM)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                        <p className="font-medium">{contact.location || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Profile */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Investment Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contact.assetClasses && contact.assetClasses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Asset Classes</h4>
                        <div className="flex flex-wrap gap-2">
                          {contact.assetClasses.map((assetClass) => (
                            <span
                              key={assetClass}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                            >
                              {assetClass}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {contact.strategy && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Investment Strategy</h4>
                        <p>{contact.strategy}</p>
                      </div>
                    )}

                    {/* Investment Preferences */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Target Investment Size</h4>
                        <p>
                          {contact.minInvestmentSize ? formatCurrency(contact.minInvestmentSize) : 'N/A'} 
                          {contact.maxInvestmentSize ? ` - ${formatCurrency(contact.maxInvestmentSize)}` : ''}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Geographic Focus</h4>
                        <p>{contact.geographicFocus || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Track Record */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Track Record</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Fund Commitments</h4>
                        <p>{contact.totalFundCommitments || 'N/A'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Direct Investments</h4>
                        <p>{contact.totalDirectInvestments || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Description */}
                {contact.companyDescription && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium">About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{contact.companyDescription}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button 
              variant="secondary"
              onClick={() => setShowAddToListDialog(true)}
            >
              Add to List
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddToListDialog
        open={showAddToListDialog}
        onOpenChange={setShowAddToListDialog}
        selectedInvestors={[contact.id]}
        onSuccess={() => {
          setShowAddToListDialog(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
