const { createMailTransporter } = require('../config/mail');

const DEFAULT_FROM = 'info@tamalarabiya.com';
const DEFAULT_TO = 'info@tamalarabiya.com';

/**
 * Send a lead notification when a visitor submits the contact form.
 */
async function sendContactNotification({ name, email, phone, subject, message }) {
  const transporter = createMailTransporter();

  const fromAddress = process.env.EMAIL_USER || DEFAULT_FROM;
  const toAddress = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_USER || DEFAULT_TO;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2C3E50; border-bottom: 2px solid #F39C12; padding-bottom: 8px;">
        New Contact Form Submission — TAM Alarabiya
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">Subject:</td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-left: 4px solid #F39C12;">
        <p style="margin: 0 0 8px; font-weight: bold;">Message:</p>
        <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #888;">
        Sent automatically from tamalarabiya.com contact form.
      </p>
    </div>
  `;

  const textBody = [
    'New Contact Form Submission — TAM Alarabiya',
    '-------------------------------------------',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  await transporter.sendMail({
    from: `"TAM Alarabiya Website" <${fromAddress}>`,
    to: toAddress,
    replyTo: email,
    subject: `[Website Lead] ${subject} — ${name}`,
    text: textBody,
    html: htmlBody,
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendContactNotification };
