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

    // Fetch the file content
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
    
    // Extract text content
    const textContent = data.text

    // Create a structured memo from the extracted text
    const memo = `
# Deal Memo

## Executive Summary
${textContent.substring(0, 500)}...

## Key Points
- Document Length: ${data.numpages} pages
- Extracted Content Length: ${textContent.length} characters

## Full Content
${textContent}
    `.trim()

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