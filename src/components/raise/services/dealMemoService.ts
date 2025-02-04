import { supabase } from "@/integrations/supabase/client";

export async function generateDealMemo(raiseData: any) {
  try {
    console.log('Generating deal memo for:', raiseData);
    const { data, error } = await supabase.functions.invoke('generate-deal-memo', {
      body: { raiseData }
    });

    if (error) {
      console.error('Error generating deal memo:', error);
      return null;
    }

    console.log('Deal memo generated:', data);
    return data.memo;
  } catch (error) {
    console.error('Error in generateDealMemo:', error);
    return null;
  }
}