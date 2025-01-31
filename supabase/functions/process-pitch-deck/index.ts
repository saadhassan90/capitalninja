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
- Investment Type (Equity, Debt, Fund, Direct Deal, etc.)
- Sector & Asset Class (Real Estate, Private Equity, Infrastructure, etc.)
- Sponsor / Company (Who is leading the deal? Key team members and their track record.)
- Investment Terms (Ownership %, valuation, IRR for equity; interest rate, maturity, covenants for debt.)
- Liquidity & Exit Plan (Expected investment horizon, planned exit routes.)

2. Why Invest? (Investment Thesis)
- Market Opportunity (Industry trends, growth potential, demand drivers.)
- Business Model / Investment Strategy (How does this investment generate returns?)
- Competitive Advantage (Unique value proposition, differentiation from competitors.)
- Track Record & Sponsor Strength (Past performance, execution ability, investor confidence.)
- Attractive Returns & Downside Protection (Projected IRR, risk mitigation strategies.)

3. Key Risks (Why NOT Invest?)
- Market Risks (Economic downturns, regulatory changes, industry saturation.)
- Execution Risks (Operational challenges, dependency on key personnel.)
- Financial Risks (Over-leverage, unsustainable cash flow, dilution risk.)
- Competitive Risks (Emerging competitors, technology shifts, market entry barriers.)
- Liquidity Risks (Long capital lock-up, unclear exit strategy.)

4. Potential Upside (Why You SHOULD Invest?)
- Strong Returns & Growth Potential (Favorable IRR, revenue expansion.)
- Market Positioning (First-mover advantage, high barriers to entry.)
- Strategic Investor Fit (Synergies, co-investment potential, alignment with investor mandates.)
- Alignment of Interest (Skin in the game from founders, investor-friendly terms.)

Use only the provided pitch deck data to create the memo. Do not make assumptions beyond what is available in the deck. Focus on the most critical investment details. Keep the memo structured and professional.

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