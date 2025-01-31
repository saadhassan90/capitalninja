import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileUrl } = await req.json()
    console.log('Processing pitch deck:', fileUrl)

    if (!fileUrl) {
      throw new Error('No file URL provided')
    }

    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Fetch the file content
    console.log('Fetching file content...')
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const fileContent = await response.text()
    console.log('File content length:', fileContent.length)

    // Process with OpenAI
    console.log('Sending request to OpenAI...')
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert financial analyst and investment professional. Create a detailed deal memo based on the pitch deck content provided. Focus on:

1. Deal Overview
- Investment type and structure
- Key terms and valuation
- Team background and track record

2. Investment Thesis
- Market opportunity and growth drivers
- Competitive advantages
- Business model and strategy

3. Risk Analysis
- Market and competitive risks
- Operational and execution risks
- Financial risks

4. Return Potential
- Expected returns and growth metrics
- Exit opportunities
- Strategic value and synergies`
          },
          {
            role: 'user',
            content: fileContent
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!openAiResponse.ok) {
      const error = await openAiResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error}`)
    }

    console.log('OpenAI Response received')
    const aiResult = await openAiResponse.json()
    const memo = aiResult.choices[0].message.content

    return new Response(
      JSON.stringify({ success: true, memo }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})