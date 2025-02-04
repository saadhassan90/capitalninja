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
    
    // Validate that raiseData exists and has required fields
    if (!raiseData) {
      throw new Error('No raise data provided')
    }

    console.log('Received raise data:', raiseData)

    // Create a structured prompt for the deal memo
    const prompt = `Create a professional investment deal memo for the following opportunity:

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

Please structure the memo with the following sections:
1. Executive Summary
2. Investment Highlights
3. Deal Structure
4. Financial Overview
5. Risk Factors and Mitigants
6. Team and Contact Information

Use a professional tone and format suitable for institutional investors.`

    console.log('Sending prompt to OpenAI:', prompt)

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
            content: 'You are an expert investment analyst who creates professional deal memos for institutional investors.' 
          },
          { role: 'user', content: prompt }
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