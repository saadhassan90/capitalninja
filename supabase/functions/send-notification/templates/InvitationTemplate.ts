
export const InvitationTemplate = (data?: { email: string; role: string; inviterName?: string }) => `
<!DOCTYPE html>
<html>
<body>
  <h1>You've been invited to join Capital Ninja</h1>
  <p>Hello,</p>
  <p>${data?.inviterName ? `${data.inviterName} has` : 'You have been'} invited you to join Capital Ninja as a ${data?.role || 'team member'}.</p>
  <p>Click the link below to join:</p>
  <p><a href="${data?.inviteUrl || 'https://app.capitalninja.ai/auth'}">Accept Invitation</a></p>
  <p>If you did not expect this invitation, you can safely ignore this email.</p>
  <p>Best regards,<br>The Capital Ninja Team</p>
</body>
</html>
`;

