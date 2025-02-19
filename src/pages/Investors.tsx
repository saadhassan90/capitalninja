
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestorsTable } from "@/components/InvestorsTable";
import { ContactsTable } from "@/components/investors/contacts/ContactsTable";
import { useState } from "react";
import { Users, Building, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InvestorContact } from "@/types/investor-contact";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

const Investors = () => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ['investor-contacts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('investor_contacts')
          .select(`
            *,
            limited_partners!fk_limited_partner (
              limited_partner_name
            )
          `);
        
        if (error) {
          console.error('Error fetching contacts:', error);
          toast.error('Failed to fetch contacts');
          throw error;
        }

        if (!data) {
          console.log('No data returned from query');
          return [];
        }

        console.log('Raw data from query:', data);
        
        const transformedData = data.map(contact => ({
          ...contact,
          company_name: contact.limited_partners?.limited_partner_name || 'N/A'
        }));

        console.log('Transformed data:', transformedData);
        
        return transformedData as InvestorContact[];
      } catch (error) {
        console.error('Error in queryFn:', error);
        toast.error('An error occurred while fetching contacts');
        return [];
      }
    },
    retry: 1
  });

  const handleSelectContact = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, id]);
    } else {
      setSelectedContacts(prev => prev.filter(contactId => contactId !== id));
    }
  };

  const handleSelectAllContacts = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Investors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Users className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground mt-1">Manage your investor relationships</p>
        </div>
      </div>

      <Tabs defaultValue="people" className="space-y-4">
        <TabsList>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Companies
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="people" className="space-y-4">
          <ContactsTable
            contacts={contacts}
            isLoading={isLoadingContacts}
            selectedContacts={selectedContacts}
            onSelectContact={handleSelectContact}
            onSelectAll={handleSelectAllContacts}
            onViewContact={(id) => console.log('View contact:', id)}
          />
        </TabsContent>
        
        <TabsContent value="companies" className="space-y-4">
          <InvestorsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Investors;
