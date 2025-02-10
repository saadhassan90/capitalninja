
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { WelcomeTemplate } from "./templates/WelcomeTemplate.ts"
import { NotificationTemplate } from "./templates/NotificationTemplate.ts"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailNotification {
  to: string
  subject: string
  templateName: "welcome" | "notification"
  data?: Record<string, any>
}

const templates = {
  welcome: WelcomeTemplate,
  notification: NotificationTemplate
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, subject, templateName, data }: EmailNotification = await req.json()

    if (!templates[templateName]) {
      throw new Error('Invalid template name')
    }

    console.log(`Sending ${templateName} email to ${to}`)

    const emailResponse = await resend.emails.send({
      from: "noreply@app.capitalninja.ai",
      to: [to],
      subject: subject,
      html: templates[templateName](data)
    })

    console.log('Email sent successfully:', emailResponse)

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
