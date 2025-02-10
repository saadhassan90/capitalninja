
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from "npm:resend@2.0.0"

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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { email, role } = await req.json()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      // Add user to team_members if not already a member
      const { error: teamMemberError } = await supabase
        .from('team_members')
        .insert({
          user_id: existingUser.id,
          role: role,
        })
        .select()
        .single()

      if (teamMemberError?.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'User is already a team member' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    } else {
      // Create invitation record
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          email,
          role,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })

      if (inviteError) throw inviteError

      // Send invitation email
      const emailResponse = await resend.emails.send({
        from: "noreply@app.capitalninja.ai",
        to: [email],
        subject: "You've been invited to join Capital Ninja",
        html: `
<!DOCTYPE html>
<html>
<body>
  <h1>You've been invited to join Capital Ninja</h1>
  <p>Hello,</p>
  <p>You have been invited to join Capital Ninja as a ${role}.</p>
  <p>Click the link below to join:</p>
  <p><a href="https://app.capitalninja.ai/auth">Accept Invitation</a></p>
  <p>If you did not expect this invitation, you can safely ignore this email.</p>
  <p>Best regards,<br>The Capital Ninja Team</p>
</body>
</html>
        `,
      })

      console.log('Invitation email sent:', emailResponse)
    }

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in invite-team-member function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
