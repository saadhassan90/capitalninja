
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

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
  welcome: (data: any) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome to Our Platform!</h1>
      <p>Hi ${data.name || 'there'},</p>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>Best regards,<br>The Team</p>
    </div>
  `,
  notification: (data: any) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${data.title || 'Notification'}</h2>
      <p>${data.message}</p>
      <p>Best regards,<br>The Team</p>
    </div>
  `
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
      from: "notifications@yourdomain.com", // Update this with your verified domain
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
