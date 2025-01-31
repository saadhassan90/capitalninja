import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the file content from storage
    console.log('Fetching file from URL...')
    const response = await fetch(fileUrl)
    if (!response.ok) {
      console.error('Failed to fetch file:', response.statusText)
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const fileContent = await response.text()
    console.log('File content length:', fileContent.length)

    // Process with OpenAI
    console.log('Sending request to OpenAI...')
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are an expert financial analyst. Create a concise deal memo based on the pitch deck.'
          },
          {
            role: 'user',
            content: fileContent
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!openAiResponse.ok) {
      const error = await openAiResponse.json()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const aiResult = await openAiResponse.json()
    console.log('OpenAI Response received')
    const memo = aiResult.choices[0].message.content

    return new Response(
      JSON.stringify({ success: true, memo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing pitch deck:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})