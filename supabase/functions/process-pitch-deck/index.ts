import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as pdfParse from 'npm:pdf-parse'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    // Step 1: Fetch and parse PDF content
    console.log('Fetching file content...')
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    
    // Parse PDF content
    console.log('Parsing PDF content...')
    const data = await pdfParse(buffer)
    const textContent = data.text
    console.log('Extracted text length:', textContent.length)

    // Step 2: Process with OpenAI
    console.log('Sending extracted text to OpenAI...')
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
            content: `You are an expert financial analyst and investment professional. Create a detailed deal memo in markdown format based on the pitch deck content provided. The memo should include:

1. Executive Summary
- Brief overview of the investment opportunity
- Key value proposition
- Investment ask and terms

2. Company Analysis
- Business model and revenue streams
- Market positioning and competitive advantages
- Team background and capabilities

3. Market Opportunity
- Market size and growth potential
- Target customer segments
- Competitive landscape

4. Financial Analysis
- Current financial position
- Key metrics and KPIs
- Growth projections and assumptions

5. Investment Thesis
- Growth drivers and catalysts
- Potential risks and mitigations
- Expected returns and exit opportunities

Format the response in clean markdown with appropriate headers, bullet points, and sections.`
          },
          {
            role: 'user',
            content: `Here is the extracted text from the pitch deck to analyze:\n\n${textContent}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
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
      JSON.stringify({ 
        success: true, 
        memo,
        metadata: {
          pages: data.numpages,
          textLength: textContent.length
        }
      }),
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