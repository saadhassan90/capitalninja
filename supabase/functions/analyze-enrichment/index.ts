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
    const { uploadData, matchedData } = await req.json()

    // Create a prompt for OpenAI to analyze the enrichment results
    const prompt = `Analyze this data enrichment process and provide insights.

Upload Summary:
- Total Records: ${uploadData.total_rows}
- Successfully Matched: ${uploadData.matched_rows}
- Match Rate: ${((uploadData.matched_rows / uploadData.total_rows) * 100).toFixed(1)}%

Sample of matched records: ${JSON.stringify(matchedData.slice(0, 3))}

Please provide:
1. A brief summary of the enrichment process
2. Analysis of what types of records were successfully enriched and why
3. Analysis of what types of records were challenging to enrich and why
4. Suggestions for improving match rates in future uploads`

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a data enrichment analyst providing insights on data matching results.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    })

    const aiResult = await openAIResponse.json()
    const analysis = aiResult.choices[0].message.content

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})