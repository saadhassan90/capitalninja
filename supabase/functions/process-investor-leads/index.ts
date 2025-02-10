
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
    const processedRecords = []

    // Process each row
    for (const row of rawData) {
      const companyName = row.company_name || row.investor_name || row.name
      const email = row.email || row.contact_email || row.primary_email
      
      if (!companyName && !email) continue

      // Try exact matches first
      const { data: exactMatches, error: matchError } = await supabase
        .from('limited_partners')
        .select('*')
        .or(`primary_contact_email.ilike.${email},limited_partner_name.ilike.${companyName}`)
        .limit(1)

      if (matchError) {
        console.error('Error matching investor:', matchError)
        continue
      }

      let bestMatch = exactMatches?.[0]
      let matchingMethod = 'exact_match'
      let matchedFields = {}

      // If no exact match, try fuzzy matching on company name
      if (!bestMatch && companyName) {
        const { data: fuzzyMatches } = await supabase
          .from('limited_partners')
          .select('*, similarity:calculate_company_similarity(limited_partner_name, ${companyName}) as score')
          .order('score', { ascending: false })
          .limit(1)

        if (fuzzyMatches?.[0]?.score > 0.6) {
          bestMatch = fuzzyMatches[0]
          matchingMethod = 'fuzzy_match'
          matchedFields = { company_name_similarity: fuzzyMatches[0].score }
        }
      }

      // Insert into master_leads with enriched data
      const { data: insertedLead, error: insertError } = await supabase
        .from('master_leads')
        .insert({
          original_upload_id: uploadId,
          uploaded_by: uploadData.user_id,
          company_name: companyName,
          matched_limited_partner_id: bestMatch?.id,
          confidence_score: bestMatch ? (matchingMethod === 'exact_match' ? 1.0 : 0.8) : 0,
          matching_method: matchingMethod,
          matched_fields: matchedFields,
          raw_data: row,
          enriched_data: bestMatch ? {
            // Include all relevant fields from our dataset
            id: bestMatch.id,
            limited_partner_name: bestMatch.limited_partner_name,
            limited_partner_type: bestMatch.limited_partner_type,
            aum: bestMatch.aum,
            year_founded: bestMatch.year_founded,
            website: bestMatch.website,
            description: bestMatch.description,
            hqlocation: bestMatch.hqlocation,
            primary_contact: bestMatch.primary_contact,
            primary_contact_email: bestMatch.primary_contact_email,
            primary_contact_title: bestMatch.primary_contact_title,
            preferred_fund_type: bestMatch.preferred_fund_type,
            preferred_geography: bestMatch.preferred_geography,
            preferred_commitment_size_min: bestMatch.preferred_commitment_size_min,
            preferred_commitment_size_max: bestMatch.preferred_commitment_size_max,
            open_to_first_time_funds: bestMatch.open_to_first_time_funds
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

    // Update upload status
    await supabase
      .from('user_uploaded_leads')
      .update({ 
        processed_status: 'completed',
        matched_rows: matchedCount,
        total_rows: rawData.length,
        column_mapping: {
          ...uploadData.column_mapping,
          enrichment_summary: `Processed ${rawData.length} records with ${matchedCount} successful matches (${((matchedCount / rawData.length) * 100).toFixed(1)}% match rate)`
        }
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
