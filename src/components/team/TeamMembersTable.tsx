
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
import { TeamMember, TeamInvitation, Role } from "@/types/team";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface TeamMembersTableProps {
  members: TeamMember[];
  invitations: TeamInvitation[];
  isLoading: boolean;
}

export function TeamMembersTable({ members, invitations, isLoading }: TeamMembersTableProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return '';
    }
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
          <TableHead>Status</TableHead>
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
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Active
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(member.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">Pending User</span>
            </TableCell>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>{invitation.role}</TableCell>
            <TableCell>
              <Badge className={`flex items-center gap-1.5 ${getStatusColor(invitation.status)}`}>
                {getStatusIcon(invitation.status)}
                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              Invited {new Date(invitation.created_at).toLocaleDateString()}
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
