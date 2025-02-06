import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { listId } = await req.json();
    console.log('Exporting list:', listId);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all investors in the list
    const { data: listInvestors, error: listError } = await supabaseClient
      .from('list_investors')
      .select('investor_id')
      .eq('list_id', listId);

    if (listError) throw listError;

    if (!listInvestors?.length) {
      throw new Error('No investors found in list');
    }

    const investorIds = listInvestors.map(li => li.investor_id);

    // Get detailed investor data
    const { data: investors, error: investorsError } = await supabaseClient
      .from('limited_partners')
      .select('*')
      .in('id', investorIds);

    if (investorsError) throw investorsError;

    // Convert to CSV
    const headers = Object.keys(investors[0]);
    const csvContent = [
      headers.join(','), // CSV header row
      ...investors.map(investor => 
        headers.map(header => {
          const value = investor[header];
          // Handle special characters and commas in CSV
          if (value === null || value === undefined) return '';
          return typeof value === 'string' 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="investor-list-${listId}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error in export-list-investors function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});