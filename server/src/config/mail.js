const nodemailer = require('nodemailer');

/**
 * Hostinger SMTP transporter (port 465, SSL).
 * Pass { user, pass } or falls back to EMAIL_USER + EMAIL_PASS from .env
 */
function createMailTransporter(credentials) {
  const user = credentials?.user ?? process.env.EMAIL_USER;
  const pass = credentials?.pass ?? process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('SMTP user and password must be set in environment variables');
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

function createSaleMailTransporter() {
  return createMailTransporter({
    user: process.env.SALE_EMAIL_USER,
    pass: process.env.SALE_EMAIL_PASS,
  });
}

function isSaleMailConfigured() {
  return Boolean(process.env.SALE_EMAIL_USER && process.env.SALE_EMAIL_PASS);
}

module.exports = { createMailTransporter, createSaleMailTransporter, isSaleMailConfigured };
