import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvestorData {
  limited_partner_name: string;
  limited_partner_type: string | null;
  preferred_fund_type: string | null;
  aum: number | null;
  hqlocation: string | null;
}

interface RaiseData {
  name: string;
  target_amount: number;
  type: string;
  category: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { investor, raise } = await req.json()

    // Initialize OpenAI
    const openai = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert investment outreach specialist. Generate a personalized email sequence for reaching out to investors. 
            Focus on matching investment preferences with opportunities while maintaining professionalism and authenticity.
            Keep emails concise and focused on value proposition.`
          },
          {
            role: "user",
            content: `Generate a personalized email sequence for an investor with the following details:
            
            Investor Information:
            ${JSON.stringify(investor, null, 2)}
            
            Raise Information:
            ${JSON.stringify(raise, null, 2)}
            
            Requirements:
            - Create 3 emails in a sequence
            - Each email should be personalized based on the investor's preferences and history
            - Focus on matching the raise with the investor's investment criteria
            - Include specific details about why this opportunity matches their portfolio
            - Keep emails concise and professional
            - End with a clear call to action
            - Return in JSON format with subject and content fields for each email`
          }
        ],
        temperature: 0.7,
      }),
    });

    const response = await openai.json();
    const sequence = JSON.parse(response.choices[0].message.content);

    return new Response(
      JSON.stringify(sequence),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})