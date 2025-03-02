
export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduled_for: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  total_recipients: number | null;
  successful_sends: number | null;
  failed_sends: number | null;
  raise?: {
    name: string;
    id: string;
  } | null;
}
