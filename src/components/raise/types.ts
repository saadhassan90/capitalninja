export interface RaiseProject {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  created_at: string;
  status: string;
  memo?: string;
}

export interface RaiseCardProps {
  project: RaiseProject;
  onDelete?: () => void;
}