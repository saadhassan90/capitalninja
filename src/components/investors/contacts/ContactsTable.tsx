
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { InvestorContact } from "@/types/investor-contact";

interface ContactsTableProps {
  contacts: InvestorContact[];
  isLoading: boolean;
  selectedContacts: string[];
  onSelectContact: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onViewContact: (id: string) => void;
}

export function ContactsTable({
  contacts,
  isLoading,
  selectedContacts,
  onSelectContact,
  onSelectAll,
  onViewContact,
}: ContactsTableProps) {
  const allSelected = contacts.length > 0 && contacts.every(contact => 
    selectedContacts.includes(contact.id)
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all contacts"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No contacts found</TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) => onSelectContact(contact.id, checked as boolean)}
                    aria-label={`Select ${contact.first_name} ${contact.last_name}`}
                  />
                </TableCell>
                <TableCell>{`${contact.first_name} ${contact.last_name}`}</TableCell>
                <TableCell>{contact.title || 'N/A'}</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>{contact.email || 'N/A'}</TableCell>
                <TableCell>{contact.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewContact(contact.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
