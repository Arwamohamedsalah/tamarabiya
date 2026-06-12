const SiteSettings = require('../models/SiteSettings');
const asyncHandler = require('../middleware/asyncHandler');
const {
  normalizeSaudiPhone,
  validateWhatsAppNumber,
  validatePhoneNumber,
  validateUrl,
} = require('../utils/contactValidation');
const {
  buildDestinationUrl,
  generateQrCodeDataUrl,
  validateSettingsPayload,
} = require('../utils/qrCodeService');

const DEFAULT_SETTINGS = {
  whatsappNumber: '+966507826024',
  phoneNumber: '+966507826024',
  websiteUrl: 'https://www.tamalarabiya.com',
  customUrl: '',
  qrDestination: 'whatsapp',
};

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(DEFAULT_SETTINGS);
    const targetUrl = buildDestinationUrl(settings.toObject());
    if (targetUrl) {
      settings.qrTargetUrl = targetUrl;
      settings.qrCodeDataUrl = await generateQrCodeDataUrl(targetUrl);
      await settings.save();
    }
  }
  return settings;
}

function formatPublicSettings(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    whatsappNumber: obj.whatsappNumber,
    phoneNumber: obj.phoneNumber,
    websiteUrl: obj.websiteUrl,
    customUrl: obj.customUrl,
    qrDestination: obj.qrDestination,
    qrCodeDataUrl: obj.qrCodeDataUrl,
    qrTargetUrl: obj.qrTargetUrl,
    updatedAt: obj.updatedAt,
  };
}

exports.getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json(formatPublicSettings(settings));
});

exports.updateSiteSettings = asyncHandler(async (req, res) => {
  const errors = validateSettingsPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join('. ') });
  }

  const whatsappCheck = validateWhatsAppNumber(req.body.whatsappNumber);
  const phoneCheck = validatePhoneNumber(req.body.phoneNumber);

  const payload = {
    whatsappNumber: whatsappCheck.normalized,
    phoneNumber: phoneCheck.normalized,
    websiteUrl: req.body.websiteUrl?.trim() || DEFAULT_SETTINGS.websiteUrl,
    customUrl: req.body.customUrl?.trim() || '',
    qrDestination: req.body.qrDestination || 'whatsapp',
  };

  if (payload.qrDestination === 'website') {
    const websiteCheck = validateUrl(payload.websiteUrl, 'Website URL');
    if (!websiteCheck.valid) {
      return res.status(400).json({ message: websiteCheck.message });
    }
    payload.websiteUrl = websiteCheck.normalized;
  }

  if (payload.qrDestination === 'custom') {
    const customCheck = validateUrl(payload.customUrl, 'Custom URL');
    if (!customCheck.valid) {
      return res.status(400).json({ message: customCheck.message });
    }
    payload.customUrl = customCheck.normalized;
  }

  const targetUrl = buildDestinationUrl(payload);
  if (!targetUrl) {
    return res.status(400).json({ message: 'Unable to build a valid QR destination URL' });
  }

  let qrCodeDataUrl;
  try {
    qrCodeDataUrl = await generateQrCodeDataUrl(targetUrl);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'QR code generation failed' });
  }

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({
      ...payload,
      qrTargetUrl: targetUrl,
      qrCodeDataUrl,
    });
  } else {
    Object.assign(settings, payload, {
      qrTargetUrl: targetUrl,
      qrCodeDataUrl,
    });
    await settings.save();
  }

  res.json(formatPublicSettings(settings));
});

exports.regenerateQrCode = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const targetUrl = buildDestinationUrl(settings.toObject());

  if (!targetUrl) {
    return res.status(400).json({ message: 'Unable to build a valid QR destination URL' });
  }

  settings.qrTargetUrl = targetUrl;
  settings.qrCodeDataUrl = await generateQrCodeDataUrl(targetUrl);
  await settings.save();

  res.json(formatPublicSettings(settings));
});
