
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InvestorContact } from "@/types/investor-contact";

interface ListDetails {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface ListInvestorJoin {
  contact_id: string;
  investor_contacts: InvestorContact;
}

export default function ListDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch list details
  const { data: list } = useQuery({
    queryKey: ["list", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as ListDetails;
    },
    enabled: !!id
  });

  // Fetch investors for the list
  const { data: listInvestors } = useQuery({
    queryKey: ["list-investors", id],
    queryFn: async () => {
      if (!id) return [];
      
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
        .eq("list_id", id);

      if (error) throw error;
      
      const typedData = data as unknown as ListInvestorJoin[];
      return typedData.map(item => item.investor_contacts).filter(Boolean);
    },
    enabled: !!id
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/lists")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
          {list?.description && (
            <p className="text-muted-foreground">{list.description}</p>
          )}
        </div>
      </div>

      <div className="rounded-md border">
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
            {listInvestors?.map((investor) => (
              <TableRow key={investor.id}>
                <TableCell>{`${investor.first_name} ${investor.last_name}`}</TableCell>
                <TableCell>{investor.title || "—"}</TableCell>
                <TableCell>{investor.company_name}</TableCell>
                <TableCell>{investor.email || "—"}</TableCell>
                <TableCell>{investor.phone || "—"}</TableCell>
              </TableRow>
            ))}
            {(!listInvestors || listInvestors.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No investors in this list yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
