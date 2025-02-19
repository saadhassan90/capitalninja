
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
import { InvestorsSearch } from "../InvestorsSearch";
import type { InvestorFilterType, AUMRange } from "@/types/investorFilters";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<InvestorFilterType>(null);
  const [selectedLocation, setSelectedLocation] = useState<InvestorFilterType>(null);
  const [selectedAssetClass, setSelectedAssetClass] = useState<InvestorFilterType>(null);
  const [selectedFirstTimeFunds, setSelectedFirstTimeFunds] = useState<InvestorFilterType>(null);
  const [selectedAUMRange, setSelectedAUMRange] = useState<AUMRange>(null);
  
  const itemsPerPage = 10;

  // Filter contacts based on search term and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === "" || 
      `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.title && contact.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !selectedType || contact.companyType === selectedType;
    const matchesLocation = !selectedLocation || contact.location === selectedLocation;
    const matchesAssetClass = !selectedAssetClass || 
      (contact.assetClasses && contact.assetClasses.includes(selectedAssetClass));

    const matchesAUM = !selectedAUMRange || 
      (!selectedAUMRange.min || (contact.companyAUM && contact.companyAUM >= selectedAUMRange.min)) &&
      (!selectedAUMRange.max || (contact.companyAUM && contact.companyAUM <= selectedAUMRange.max));

    return matchesSearch && matchesType && matchesLocation && matchesAssetClass && matchesAUM;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const allSelected = currentContacts.length > 0 && 
    currentContacts.every(contact => selectedContacts.includes(contact.id));

  const handleFilterChange = (
    type: InvestorFilterType, 
    location: InvestorFilterType, 
    assetClass: InvestorFilterType,
    firstTimeFunds: InvestorFilterType,
    aumRange: AUMRange
  ) => {
    if (type !== null) setSelectedType(type);
    if (location !== null) setSelectedLocation(location);
    if (assetClass !== null) setSelectedAssetClass(assetClass);
    if (firstTimeFunds !== null) setSelectedFirstTimeFunds(firstTimeFunds);
    if (aumRange !== null) setSelectedAUMRange(aumRange);
    setCurrentPage(1);
  };

  const formatAUM = (aum: number | null) => {
    if (!aum) return 'N/A';
    return `$${(aum / 1000000000).toFixed(1)}B`;
  };

  return (
    <div className="space-y-4">
      <InvestorsSearch 
        value={searchTerm}
        onChange={setSearchTerm}
        onFilterChange={handleFilterChange}
      />

      {selectedContacts.length > 0 && (
        <BulkActions
          selectedCount={selectedContacts.length}
          selectedInvestors={selectedContacts}
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
