
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvestorsPagination } from "@/components/investors/InvestorsPagination";
import { BulkActions } from "@/components/investors/BulkActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { InvestorContact } from "@/types/investor-contact";
import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = contacts.slice(startIndex, endIndex);

  const allSelected = currentContacts.length > 0 && 
    currentContacts.every(contact => selectedContacts.includes(contact.id));

  const formatAUM = (aum: number | null) => {
    if (!aum) return 'N/A';
    return `$${(aum / 1000000000).toFixed(1)}B`;
  };

  return (
    <div className="space-y-4">
      {selectedContacts.length > 0 && (
        <BulkActions
          selectedCount={selectedContacts.length}
          selectedInvestors={selectedContacts.map(id => parseInt(id))}
          onClearSelection={() => onSelectAll(false)}
          listId=""
        />
      )}

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
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead className="w-[120px]">Title</TableHead>
              <TableHead className="w-[180px]">Company</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead className="w-[120px]">AUM</TableHead>
              <TableHead className="w-[180px]">Asset Classes</TableHead>
              <TableHead className="w-[150px]">Location</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : currentContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">No contacts found</TableCell>
              </TableRow>
            ) : (
              currentContacts.map((contact) => (
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
                  <TableCell>{contact.company_name}</TableCell>
                  <TableCell>{contact.companyType || 'N/A'}</TableCell>
                  <TableCell>{formatAUM(contact.companyAUM)}</TableCell>
                  <TableCell>{contact.assetClasses?.join(', ') || 'N/A'}</TableCell>
                  <TableCell>{contact.location || 'N/A'}</TableCell>
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

      {contacts.length > itemsPerPage && (
        <InvestorsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
