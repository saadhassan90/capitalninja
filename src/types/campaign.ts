export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  list_id: string;
  scheduled_for: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  total_recipients: number;
  successful_sends: number;
  failed_sends: number;
  lists?: {
    name: string;
  };
}