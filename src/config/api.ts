/**
 * API base URL for JSON endpoints (e.g. /api/images, /api/site-settings).
 * In development, defaults to `/api` so Vite proxies to localhost:5000.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://www.tamarabiya.com/api');

/**
 * Origin used for file/download links (no trailing /api).
 */
export const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'https://www.tamarabiya.com');

export const DEFAULT_SITE_SETTINGS = {
  whatsappNumber: '+966507826024',
  phoneNumber: '+966507826024',
  websiteUrl: 'https://www.tamalarabiya.com',
  customUrl: '',
  qrDestination: 'whatsapp' as const,
  qrCodeDataUrl: '',
  qrTargetUrl: 'https://wa.me/966507826024',
};
