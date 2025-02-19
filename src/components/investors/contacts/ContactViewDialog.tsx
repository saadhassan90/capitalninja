
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Mail } from "lucide-react";
import { AddToListDialog } from "@/components/investors/AddToListDialog";
import { useState } from "react";
import type { InvestorContact } from "@/types/investor-contact";

interface ContactViewDialogProps {
  contact: InvestorContact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactViewDialog({ contact, open, onOpenChange }: ContactViewDialogProps) {
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);

  if (!contact) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Contact Details</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
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

            <div className="flex justify-end">
              <Button 
                variant="secondary"
                onClick={() => setShowAddToListDialog(true)}
              >
                Add to List
              </Button>
            </div>
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
