const SAUDI_MOBILE_PATTERN = /^(\+966|966|0)?5[0-9]{8}$/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizeSaudiPhone(value: string): string | null {
  const digits = digitsOnly(value);
  if (!digits) return null;

  let local = digits;
  if (local.startsWith('966')) {
    local = local.slice(3);
  } else if (local.startsWith('0')) {
    local = local.slice(1);
  }

  const candidate = `+966${local}`;
  return /^\+9665[0-9]{8}$/.test(candidate) ? candidate : null;
}

export function isValidSaudiPhone(value: string): boolean {
  const digits = digitsOnly(value);
  return SAUDI_MOBILE_PATTERN.test(digits) || SAUDI_MOBILE_PATTERN.test(value);
}

export function getWhatsAppUrl(whatsappNumber: string): string | null {
  const normalized = normalizeSaudiPhone(whatsappNumber);
  if (!normalized) return null;
  return `https://wa.me/${digitsOnly(normalized)}`;
}

export function getTelUrl(phoneNumber: string): string | null {
  const normalized = normalizeSaudiPhone(phoneNumber);
  if (!normalized) return null;
  return `tel:${normalized}`;
}

export function getQrDestinationLabel(
  destination: string,
  t: (key: string) => string
): string {
  switch (destination) {
    case 'whatsapp':
      return t('contact:qr.destinations.whatsapp');
    case 'phone':
      return t('contact:qr.destinations.phone');
    case 'website':
      return t('contact:qr.destinations.website');
    case 'custom':
      return t('contact:qr.destinations.custom');
    default:
      return destination;
  }
}
