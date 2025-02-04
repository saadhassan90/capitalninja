import { supabase } from "@/integrations/supabase/client";

export async function uploadPitchDeck(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('pitch_decks')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('pitch_decks')
    .getPublicUrl(filePath);

  return publicUrl;
}