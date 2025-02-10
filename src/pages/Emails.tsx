
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Trash2, ActivitySquare, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Emails() {
  const navigate = useNavigate();

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['email-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_accounts')
        .select(`
          *,
          email_domains (
            domain_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Management</h1>
          <p className="text-muted-foreground">
            Manage your email accounts and warm-up settings
          </p>
        </div>
        <Button onClick={() => navigate("/emails/add")}>
          <Mail className="w-4 h-4 mr-2" />
          Add Email
        </Button>
      </div>

      {accountsLoading ? (
        <div>Loading accounts...</div>
      ) : accounts?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Email Accounts</CardTitle>
            <CardDescription>
              Get started by adding your first email account
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily Limit</TableHead>
              <TableHead>Warmup</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Emails Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts?.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.email}</TableCell>
                <TableCell>{account.status}</TableCell>
                <TableCell>{account.daily_limit}</TableCell>
                <TableCell>
                  <Button 
                    variant={account.warmup_enabled ? "secondary" : "outline"} 
                    size="sm"
                  >
                    <Thermometer className="w-4 h-4 mr-2" />
                    {account.warmup_enabled ? "Enabled" : "Disabled"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <ActivitySquare className="w-4 h-4 mr-2" />
                    View Score
                  </Button>
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
