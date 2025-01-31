import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { raiseId, fileUrl } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the file content from storage
    const response = await fetch(fileUrl)
    const fileContent = await response.text()

    // Process with OpenAI
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial analyst and investment professional. Your task is to generate a concise, high-level deal memo for a private investment opportunity based on the provided pitch deck.'
          },
          {
            role: 'user',
            content: `Please analyze this pitch deck and create a deal memo following this format:

1. Deal Overview
- Investment Type
- Sector & Asset Class
- Sponsor / Company
- Investment Terms
- Liquidity & Exit Plan

2. Why Invest? (Investment Thesis)
- Market Opportunity
- Business Model / Investment Strategy
- Competitive Advantage
- Track Record & Sponsor Strength
- Attractive Returns & Downside Protection

3. Key Risks
- Market Risks
- Execution Risks
- Financial Risks
- Competitive Risks
- Liquidity Risks

4. Potential Upside
- Strong Returns & Growth Potential
- Market Positioning
- Strategic Investor Fit
- Alignment of Interest

Here's the pitch deck content:
${fileContent}`
          }
        ],
        temperature: 0.7,
      }),
    })

    const aiResult = await openAiResponse.json()
    const memo = aiResult.choices[0].message.content

    // Update the raise with the generated memo
    const { error: updateError } = await supabase
      .from('raises')
      .update({ memo })
      .eq('id', raiseId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, memo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing pitch deck:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})