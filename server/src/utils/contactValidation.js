const SAUDI_MOBILE_REGEX = /^(\+966|966|0)?5[0-9]{8}$/;

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

/**
 * Normalize Saudi mobile to E.164 (+9665XXXXXXXX)
 */
function normalizeSaudiPhone(value) {
  const digits = digitsOnly(value);
  if (!digits) return null;

  let normalized = digits;
  if (normalized.startsWith('966')) {
    normalized = normalized.slice(3);
  } else if (normalized.startsWith('0')) {
    normalized = normalized.slice(1);
  }

  const candidate = `+966${normalized}`;
  if (!/^\+9665[0-9]{8}$/.test(candidate)) {
    return null;
  }

  return candidate;
}

function validateSaudiPhone(value, fieldLabel = 'Phone number') {
  if (!value || !String(value).trim()) {
    return { valid: false, message: `${fieldLabel} is required` };
  }

  const normalized = normalizeSaudiPhone(value);
  if (!normalized) {
    return { valid: false, message: `${fieldLabel} must be a valid Saudi mobile number` };
  }

  return { valid: true, normalized };
}

function validateWhatsAppNumber(value) {
  return validateSaudiPhone(value, 'WhatsApp number');
}

function validatePhoneNumber(value) {
  return validateSaudiPhone(value, 'Phone number');
}

function validateUrl(value, fieldLabel = 'URL') {
  if (!value || !String(value).trim()) {
    return { valid: false, message: `${fieldLabel} is required` };
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, message: `${fieldLabel} must start with http:// or https://` };
    }
    return { valid: true, normalized: url.toString() };
  } catch {
    return { valid: false, message: `${fieldLabel} is invalid` };
  }
}

function toWhatsAppDigits(e164Phone) {
  return digitsOnly(e164Phone);
}

module.exports = {
  SAUDI_MOBILE_REGEX,
  normalizeSaudiPhone,
  validateSaudiPhone,
  validateWhatsAppNumber,
  validatePhoneNumber,
  validateUrl,
  toWhatsAppDigits,
};
