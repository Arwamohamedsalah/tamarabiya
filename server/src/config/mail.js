const nodemailer = require('nodemailer');

/**
 * Hostinger SMTP transporter (port 465, SSL).
 * Credentials: EMAIL_USER + EMAIL_PASS from .env
 */
function createMailTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment variables');
  }

  return nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
}

module.exports = { createMailTransporter };
