'use strict'

const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }
  return transporter
}

async function sendInvitationEmail({ to, invitedBy, roleName, appUrl }) {
  const transport = getTransporter()
  await transport.sendMail({
    from: `MAllPrint CRM <${process.env.GMAIL_USER}>`,
    to,
    subject: 'You have been invited to MAllPrint CRM',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f8fafc; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: #2563eb; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;">
            <span style="color: white; font-size: 20px;">🖨️</span>
          </div>
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a;">MAllPrint CRM</h1>
        </div>

        <div style="background: white; border-radius: 10px; padding: 24px; border: 1px solid #e2e8f0;">
          <h2 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #0f172a;">You've been invited!</h2>
          <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">
            <strong style="color: #0f172a;">${invitedBy}</strong> has invited you to join MAllPrint CRM as <strong style="color: #0f172a;">${roleName}</strong>.
          </p>

          <p style="margin: 0 0 20px; font-size: 14px; color: #64748b;">
            Sign in with your Google account (<strong>${to}</strong>) to access the system.
          </p>

          <a href="${appUrl}/login" style="display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Sign in to MAllPrint CRM
          </a>
        </div>

        <p style="margin: 16px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
          Authorised accounts only. If you did not expect this invitation, you can ignore this email.
        </p>
      </div>
    `,
  })
}

module.exports = { sendInvitationEmail }
