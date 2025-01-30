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
    const { headers, sampleData } = await req.json()

    // Create a prompt that describes our database schema and asks for column mapping
    const prompt = `Analyze these CSV columns and map them to our investor database schema. The CSV headers are: ${headers.join(', ')}

Here's a sample of the data:
${JSON.stringify(sampleData, null, 2)}

Our database schema has these main fields for investors:
- limited_partner_name (company name)
- limited_partner_type (investor type)
- aum (assets under management)
- hqlocation (headquarters location)
- website
- primary_contact
- primary_contact_email
- primary_contact_phone

For each CSV column, determine:
1. Which database field it should map to (if any)
2. Confidence level in the mapping (high, medium, low)
3. Any data transformation needed

Return the response as a JSON object with this structure:
{
  "mappings": [
    {
      "csvColumn": "string",
      "dbField": "string",
      "confidence": "high|medium|low",
      "transform": "string"
    }
  ]
}`

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a data analyst helping to map CSV columns to a database schema.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
      }),
    })

    const aiResult = await openAIResponse.json()
    console.log('AI Analysis Result:', aiResult)

    let mappings
    try {
      // Extract the JSON from the AI response
      const content = aiResult.choices[0].message.content
      mappings = JSON.parse(content)
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Failed to parse AI response')
    }

    return new Response(
      JSON.stringify(mappings),
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