import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string | null;
  userInitials: string;
}

export function UserAvatar({ avatarUrl, userInitials }: UserAvatarProps) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatarUrl || undefined} />
      <AvatarFallback>{userInitials}</AvatarFallback>
    </Avatar>
  );
}