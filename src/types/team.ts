
export type Role = "owner" | "administrator" | "viewer";

export interface TeamMember {
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
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: Role;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
}

