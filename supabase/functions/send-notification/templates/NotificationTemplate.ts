
export const NotificationTemplate = (data: { title?: string; message: string }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Notification'} - Capital Ninja</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px; font-weight: 600;">
            ${data.title || 'Notification'}
          </h2>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            ${data.message}
          </p>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 24px;">
            Best regards,<br>
            The Capital Ninja Team
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px; margin: 0;">
            © ${new Date().getFullYear()} Capital Ninja. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`
