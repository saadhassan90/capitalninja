import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { raiseData } = await req.json()
    
    if (!raiseData) {
      throw new Error('No raise data provided')
    }

    console.log('Received raise data:', raiseData)

    // First, let's get some market research data using a web search
    const searchPrompt = `Latest market research and trends for ${raiseData.investment_type} investments in ${raiseData.asset_classes.join(', ')} sector, focusing on ${raiseData.city}, ${raiseData.state}, ${raiseData.country}. Include economic indicators, market dynamics, and growth projections.`;

    const researchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a market research analyst. Provide concise, data-driven insights about market conditions, trends, and opportunities. Focus on recent and relevant information.' 
          },
          { role: 'user', content: searchPrompt }
        ],
        temperature: 0.3,
      }),
    })

    const researchData = await researchResponse.json()
    const marketResearch = researchData.choices[0].message.content

    // Now create the comprehensive deal memo prompt
    const memoPrompt = `Create a professional investment deal memo incorporating both the provided deal information and current market research. Use this structured format:

DEAL INFORMATION:
Company/Fund Name: ${raiseData.raise_name || 'N/A'}
Target Raise: $${raiseData.target_raise || 'N/A'}
Investment Type: ${raiseData.investment_type || 'N/A'}
Asset Classes: ${Array.isArray(raiseData.asset_classes) ? raiseData.asset_classes.join(', ') : 'N/A'}
Location: ${raiseData.city || 'N/A'}, ${raiseData.state || 'N/A'}, ${raiseData.country || 'N/A'}
Minimum Ticket Size: $${raiseData.minimum_ticket_size || 'N/A'}
Capital Stack Position: ${Array.isArray(raiseData.capital_stack) ? raiseData.capital_stack.join(', ') : 'N/A'}
GP Capital Commitment: ${raiseData.gp_capital || 'N/A'}%
Carried Interest: ${raiseData.carried_interest || 'N/A'}%
Description: ${raiseData.raise_description || 'N/A'}

MARKET RESEARCH INSIGHTS:
${marketResearch}

Please create a comprehensive deal memo with the following sections:

1. Executive Summary
   - Brief overview of the investment opportunity
   - Key investment highlights
   - Summary of target returns

2. Market Analysis
   - Current market conditions and trends
   - Competitive landscape
   - Growth drivers and market opportunities
   - Relevant economic indicators

3. Investment Strategy
   - Investment thesis
   - Value creation plan
   - Exit strategy
   - Target timeline

4. Financial Structure
   - Capital stack details
   - Fee structure
   - Distribution waterfall
   - Key terms

5. Risk Analysis
   - Key risk factors
   - Mitigation strategies
   - Market-specific considerations
   - Regulatory and compliance factors

6. Management & Track Record
   - Team overview
   - Historical performance
   - Relevant experience
   - Key personnel

7. Contact Information
   - Primary contact details
   - Investment process next steps

Use a professional tone suitable for institutional investors. Include specific data points and market research where relevant. Format the memo in a clear, structured manner with appropriate headings and subheadings.`

    console.log('Sending enhanced prompt to OpenAI:', memoPrompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert investment analyst who creates professional deal memos for institutional investors. Your memos should be data-driven, comprehensive, and actionable.' 
          },
          { role: 'user', content: memoPrompt }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI')
    }

    const memo = data.choices[0].message.content

    return new Response(
      JSON.stringify({ memo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating deal memo:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})