import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { investor, campaign } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at writing personalized email outreach sequences for investors. 
            Focus on creating compelling, professional emails that highlight the investment opportunity 
            while maintaining authenticity and avoiding generic language.`
          },
          {
            role: 'user',
            content: `Write a personalized email sequence for an investor with the following details:
            
            Investor Information:
            ${JSON.stringify(investor, null, 2)}
            
            Campaign/Raise Information:
            ${JSON.stringify(campaign, null, 2)}
            
            Requirements:
            - Create 3 emails in a sequence
            - Each email should be personalized based on the investor's preferences and history
            - Focus on matching the raise with the investor's investment criteria
            - Include specific details about why this opportunity matches their portfolio
            - Keep emails concise and professional
            - End with a clear call to action
            
            Return in JSON format with an array of objects containing:
            {
              title: string;
              subject: string;
              content: string;
              delay: number;
            }`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const sequence = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(sequence), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});