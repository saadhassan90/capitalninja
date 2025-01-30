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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { uploadId } = await req.json()

    // Get the uploaded data
    const { data: uploadData, error: uploadError } = await supabase
      .from('user_uploaded_leads')
      .select('*')
      .eq('id', uploadId)
      .single()

    if (uploadError || !uploadData) {
      throw new Error('Upload not found')
    }

    // Update status to processing
    await supabase
      .from('user_uploaded_leads')
      .update({ processed_status: 'processing' })
      .eq('id', uploadId)

    const rawData = uploadData.raw_data
    let matchedCount = 0
    const processedRecords = []

    // Process each row with AI assistance
    for (const row of rawData) {
      const companyName = row.company_name || row.investor_name || row.name

      if (!companyName) continue

      // Use OpenAI to help with matching
      const matchingPrompt = `Find the best matching investor from our database for this company: "${companyName}".
      Consider variations in company names, abbreviations, and common aliases.
      Return a confidence score between 0 and 1, where:
      1.0 = Exact match
      0.8-0.9 = Very high confidence (minor variations)
      0.6-0.7 = High confidence (significant variations but likely same company)
      0.4-0.5 = Medium confidence (possible match but needs verification)
      <0.4 = Low confidence (likely different companies)`

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a data matching expert helping to match company names.' 
            },
            { role: 'user', content: matchingPrompt }
          ],
          temperature: 0.1,
        }),
      })

      const aiResult = await aiResponse.json()
      const aiSuggestions = aiResult.choices[0].message.content

      // Search for matching investor with AI suggestions
      const { data: matches, error: matchError } = await supabase
        .from('limited_partners')
        .select('id, limited_partner_name, limited_partner_type, aum')
        .or(`limited_partner_name.ilike.%${companyName}%,limited_partner_former_name.ilike.%${companyName}%,limited_partner_also_known_as.ilike.%${companyName}%`)
        .limit(5)

      if (matchError) {
        console.error('Error matching investor:', matchError)
        continue
      }

      const bestMatch = matches?.[0]
      const confidenceScore = bestMatch ? 0.8 : 0 // Simple scoring for now

      // Insert into master_leads
      const { data: insertedLead, error: insertError } = await supabase
        .from('master_leads')
        .insert({
          original_upload_id: uploadId,
          uploaded_by: uploadData.user_id,
          company_name: companyName,
          matched_limited_partner_id: bestMatch?.id,
          confidence_score: confidenceScore,
          raw_data: row,
          enriched_data: bestMatch ? {
            matched_investor: bestMatch,
            ai_analysis: aiSuggestions
          } : null,
          last_validated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting master lead:', insertError)
        continue
      }

      if (bestMatch) {
        matchedCount++
        processedRecords.push(insertedLead)
      }
    }

    // Get AI analysis of the enrichment process
    const analysisResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/analyze-enrichment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uploadData: {
          total_rows: rawData.length,
          matched_rows: matchedCount
        },
        matchedData: processedRecords
      })
    })

    const { analysis } = await analysisResponse.json()

    // Update upload status with analysis
    await supabase
      .from('user_uploaded_leads')
      .update({ 
        processed_status: 'completed',
        matched_rows: matchedCount,
        total_rows: rawData.length,
        column_mapping: {
          ...uploadData.column_mapping,
          enrichment_analysis: analysis
        }
      })
      .eq('id', uploadId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        matchedCount,
        totalRows: rawData.length,
        analysis 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})