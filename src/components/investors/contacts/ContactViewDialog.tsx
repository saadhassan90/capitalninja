
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Mail, Building } from "lucide-react";
import { AddToListDialog } from "@/components/investors/AddToListDialog";
import { useState } from "react";
import type { InvestorContact } from "@/types/investor-contact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
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
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-3">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{contact.company_name}</h3>
                    <p className="text-muted-foreground">{contact.companyType || 'No type specified'}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">AUM</h4>
                      <p>{formatAUM(contact.companyAUM)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <p>{contact.location || 'N/A'}</p>
                    </div>
                  </div>

                  {contact.assetClasses && contact.assetClasses.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Asset Classes</h4>
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
                      <h4 className="font-medium mb-2">Investment Strategy</h4>
                      <p className="text-muted-foreground">{contact.strategy}</p>
                    </div>
                  )}

                  {contact.companyDescription && (
                    <div>
                      <h4 className="font-medium mb-2">Company Description</h4>
                      <p className="text-muted-foreground">{contact.companyDescription}</p>
                    </div>
                  )}
                </div>
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
        selectedInvestors={[parseInt(contact.id)]}
        onSuccess={() => {
          setShowAddToListDialog(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
