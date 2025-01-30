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

    // Process each row
    for (const row of rawData) {
      const companyName = row.company_name || row.investor_name || row.name

      if (!companyName) continue

      // Search for matching investor
      const { data: matches, error: matchError } = await supabase
        .from('limited_partners')
        .select('id, limited_partner_name')
        .ilike('limited_partner_name', `%${companyName}%`)
        .limit(1)

      if (matchError) {
        console.error('Error matching investor:', matchError)
        continue
      }

      const match = matches?.[0]
      const confidenceScore = match ? 0.8 : 0 // Simple scoring for now

      // Insert into master_leads
      const { error: insertError } = await supabase
        .from('master_leads')
        .insert({
          original_upload_id: uploadId,
          uploaded_by: uploadData.user_id,
          company_name: companyName,
          matched_limited_partner_id: match?.id,
          confidence_score: confidenceScore,
          raw_data: row,
          enriched_data: match ? { matched_investor: match } : null,
          last_validated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error inserting master lead:', insertError)
        continue
      }

      if (match) matchedCount++
    }

    // Update upload status
    await supabase
      .from('user_uploaded_leads')
      .update({ 
        processed_status: 'completed',
        matched_rows: matchedCount,
        total_rows: rawData.length
      })
      .eq('id', uploadId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        matchedCount,
        totalRows: rawData.length 
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