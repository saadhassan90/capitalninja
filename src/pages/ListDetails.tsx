
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { InvestorsPagination } from "@/components/investors/InvestorsPagination";
import type { InvestorContact } from "@/types/investor-contact";

interface ListInvestorJoin {
  contact_id: string;
  investor_contacts: InvestorContact;
}

export default function ListDetails() {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: list } = useQuery({
    queryKey: ["list", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: investorsData } = useQuery({
    queryKey: ["list-investors", id, currentPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("list_investors")
        .select(`
          contact_id,
          investor_contacts:contact_id (
            id,
            first_name,
            last_name,
            email,
            title,
            company_name,
            linkedin_url,
            phone
          )
        `)
        .eq("list_id", id)
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (error) throw error;
      
      const typedData = data as unknown as ListInvestorJoin[];
      return {
        investors: typedData.map(item => item.investor_contacts).filter(Boolean),
        total: typedData.length
      };
    },
  });

  return (
    <div className="h-screen flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
        <p className="text-muted-foreground">
          {list?.description || "No description provided"}
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <div className="rounded-md border h-full flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investorsData?.investors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell>{`${investor.first_name} ${investor.last_name}`}</TableCell>
                  <TableCell>{investor.title || "—"}</TableCell>
                  <TableCell>{investor.company_name}</TableCell>
                  <TableCell>{investor.email || "—"}</TableCell>
                  <TableCell>{investor.phone || "—"}</TableCell>
                </TableRow>
              ))}
              {(!investorsData?.investors || investorsData.investors.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No investors in this list yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-auto">
            <InvestorsPagination
              currentPage={currentPage}
              totalPages={Math.ceil((investorsData?.total || 0) / pageSize)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
