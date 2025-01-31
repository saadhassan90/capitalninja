export interface RaiseProject {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  created_at: string;
  status: string;
  memo?: string;
  type: string;
  category: string;
  pitch_deck_url?: string;
}

export interface RaiseCardProps {
  project: RaiseProject;
  onDelete?: () => void;
}