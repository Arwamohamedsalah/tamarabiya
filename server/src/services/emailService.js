const {
  createMailTransporter,
  createSaleMailTransporter,
  isSaleMailConfigured,
} = require('../config/mail');

const DEFAULT_INFO_FROM = 'info@tamarabiya.com';
const DEFAULT_INFO_TO = 'info@tamarabiya.com';
const DEFAULT_SALE_FROM = 'sale@tamarbiya.com';
const DEFAULT_SALE_TO = 'sale@tamarbiya.com';

function buildContactMailContent({ name, email, phone, subject, message }) {
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

  return {
    subject: `[Website Lead] ${subject} — ${name}`,
    text: textBody,
    html: htmlBody,
    replyTo: email,
  };
}

/**
 * Send a lead notification when a visitor submits the contact form.
 * Delivers to info@ and sale@ Hostinger mailboxes (each via its own SMTP when configured).
 */
async function sendContactNotification({ name, email, phone, subject, message }) {
  const content = buildContactMailContent({ name, email, phone, subject, message });

  const infoFrom = process.env.EMAIL_USER || DEFAULT_INFO_FROM;
  const infoTo = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_USER || DEFAULT_INFO_TO;

  const sends = [
    createMailTransporter().sendMail({
      from: `"TAM Alarabiya Website" <${infoFrom}>`,
      to: infoTo,
      ...content,
    }),
  ];

  if (isSaleMailConfigured()) {
    const saleFrom = process.env.SALE_EMAIL_USER || DEFAULT_SALE_FROM;
    const saleTo =
      process.env.CONTACT_SALE_EMAIL_TO || process.env.SALE_EMAIL_USER || DEFAULT_SALE_TO;

    sends.push(
      createSaleMailTransporter().sendMail({
        from: `"TAM Alarabiya Website" <${saleFrom}>`,
        to: saleTo,
        ...content,
      })
    );
  } else {
    const saleTo = process.env.CONTACT_SALE_EMAIL_TO || DEFAULT_SALE_TO;
    sends.push(
      createMailTransporter().sendMail({
        from: `"TAM Alarabiya Website" <${infoFrom}>`,
        to: saleTo,
        ...content,
      })
    );
  }

  await Promise.all(sends);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendContactNotification };
