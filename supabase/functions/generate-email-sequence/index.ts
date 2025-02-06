import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Generating sequence for:', { investor, campaign });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
            
            Return in this exact JSON format:
            [
              {
                "title": "Initial Outreach",
                "subject": "subject line here",
                "content": "email content here",
                "delay": 0
              },
              {
                "title": "Follow-up",
                "subject": "subject line here",
                "content": "email content here",
                "delay": 3
              },
              {
                "title": "Final Follow-up",
                "subject": "subject line here",
                "content": "email content here",
                "delay": 7
              }
            ]`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const sequence = JSON.parse(data.choices[0].message.content);
    console.log('Generated sequence:', sequence);

    return new Response(JSON.stringify(sequence), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-email-sequence function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});