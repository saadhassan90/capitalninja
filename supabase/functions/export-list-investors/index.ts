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

    // Get user's team_id
    const { data: { user } } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] || '');
    if (!user) throw new Error('Unauthorized');

    const { data: teamMember } = await supabaseClient
      .from('team_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!teamMember) throw new Error('No team found');

    // Check monthly export limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyExports } = await supabaseClient
      .from('exports')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamMember.id)
      .gte('created_at', startOfMonth.toISOString());

    const { data: teamLimit } = await supabaseClient
      .from('team_export_limits')
      .select('monthly_limit')
      .eq('team_id', teamMember.id)
      .single();

    const monthlyLimit = teamLimit?.monthly_limit ?? 200;

    // Get all investors in the list
    const { data: listInvestors, error: listError } = await supabaseClient
      .from('list_investors')
      .select('investor_id')
      .eq('list_id', listId);

    if (listError) throw listError;

    if (!listInvestors?.length) {
      throw new Error('No investors found in list');
    }

    // Check if adding these records would exceed the monthly limit
    if ((monthlyExports || 0) + listInvestors.length > monthlyLimit) {
      throw new Error(`Export would exceed monthly limit of ${monthlyLimit} records`);
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
          return typeof value === 'string' 
            ? `"${value.replace(/"/g, '""')}"` 
            : value ?? '';
        }).join(',')
      )
    ].join('\n');

    // Create export record
    const { error: exportError } = await supabaseClient
      .from('exports')
      .insert({
        name: `List Export ${new Date().toISOString()}`,
        type: 'list',
        records: investors.length,
        status: 'complete',
        team_id: teamMember.id,
        created_by: user.id
      });

    if (exportError) throw exportError;

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
        status: error.message.includes('monthly limit') ? 429 : 400,
      }
    );
  }
});