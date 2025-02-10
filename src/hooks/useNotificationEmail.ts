
import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface SendEmailParams {
  to: string
  subject: string
  templateName: "welcome" | "notification"
  data?: Record<string, any>
}

export function useNotificationEmail() {
  const { toast } = useToast()

  const sendEmail = useCallback(async ({ to, subject, templateName, data }: SendEmailParams) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-notification', {
        body: { to, subject, templateName, data }
      })

      if (error) throw error

      console.log('Email sent successfully:', response)
      return response
    } catch (error: any) {
      console.error('Failed to send email:', error)
      toast({
        title: "Error sending email",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }, [toast])

  return { sendEmail }
}
