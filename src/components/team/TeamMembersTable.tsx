import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/integrations/supabase/types";

type Role = "owner" | "administrator" | "viewer";

type TeamMember = {
  id: string;
  user_id: string;
  role: Role;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

interface TeamMembersTableProps {
  members: TeamMember[];
  isLoading: boolean;
}

export function TeamMembersTable({ members, isLoading }: TeamMembersTableProps) {
  const { toast } = useToast();

  const handleRoleChange = async (memberId: string, newRole: Role) => {
    const { error } = await supabase
      .from("team_members")
      .update({ role: newRole })
      .eq("id", memberId);

    if (error) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role updated",
      description: "Team member's role has been updated successfully.",
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {member.profiles.first_name?.[0]}
                  {member.profiles.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span>
                {member.profiles.first_name} {member.profiles.last_name}
              </span>
            </TableCell>
            <TableCell>{member.profiles.email}</TableCell>
            <TableCell>
              <Select
                defaultValue={member.role}
                onValueChange={(value: Role) => handleRoleChange(member.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="viewer">View Only</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {new Date(member.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}