const QRCode = require('qrcode');
const {
  normalizeSaudiPhone,
  validateUrl,
  toWhatsAppDigits,
} = require('./contactValidation');

const QR_DESTINATIONS = ['whatsapp', 'phone', 'website', 'custom'];

function buildDestinationUrl(settings) {
  const destination = settings.qrDestination || 'whatsapp';

  switch (destination) {
    case 'whatsapp': {
      const phone = normalizeSaudiPhone(settings.whatsappNumber);
      if (!phone) return null;
      return `https://wa.me/${toWhatsAppDigits(phone)}`;
    }
    case 'phone': {
      const phone = normalizeSaudiPhone(settings.phoneNumber);
      if (!phone) return null;
      return `tel:${phone}`;
    }
    case 'website': {
      const urlCheck = validateUrl(settings.websiteUrl, 'Website URL');
      return urlCheck.valid ? urlCheck.normalized : null;
    }
    case 'custom': {
      const urlCheck = validateUrl(settings.customUrl, 'Custom URL');
      return urlCheck.valid ? urlCheck.normalized : null;
    }
    default:
      return null;
  }
}

async function generateQrCodeDataUrl(targetUrl) {
  if (!targetUrl) {
    throw new Error('Cannot generate QR code without a valid destination URL');
  }

  return QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 512,
    color: {
      dark: '#1a252f',
      light: '#ffffff',
    },
  });
}

function validateSettingsPayload(body) {
  const errors = [];
  const destination = body.qrDestination || 'whatsapp';

  if (!QR_DESTINATIONS.includes(destination)) {
    errors.push('Invalid QR destination type');
  }

  const { validateWhatsAppNumber, validatePhoneNumber } = require('./contactValidation');

  const whatsappCheck = validateWhatsAppNumber(body.whatsappNumber);
  if (!whatsappCheck.valid) errors.push(whatsappCheck.message);

  const phoneCheck = validatePhoneNumber(body.phoneNumber);
  if (!phoneCheck.valid) errors.push(phoneCheck.message);

  if (body.websiteUrl) {
    const websiteCheck = validateUrl(body.websiteUrl, 'Website URL');
    if (!websiteCheck.valid) errors.push(websiteCheck.message);
  }

  if (destination === 'custom') {
    const customCheck = validateUrl(body.customUrl, 'Custom URL');
    if (!customCheck.valid) errors.push(customCheck.message);
  }

  if (destination === 'website' && body.websiteUrl) {
    const websiteCheck = validateUrl(body.websiteUrl, 'Website URL');
    if (!websiteCheck.valid) errors.push(websiteCheck.message);
  }

  return errors;
}

module.exports = {
  QR_DESTINATIONS,
  buildDestinationUrl,
  generateQrCodeDataUrl,
  validateSettingsPayload,
};
