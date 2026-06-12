export type QrDestination = 'whatsapp' | 'phone' | 'website' | 'custom';

export interface SiteSettings {
  whatsappNumber: string;
  phoneNumber: string;
  websiteUrl: string;
  customUrl: string;
  qrDestination: QrDestination;
  qrCodeDataUrl: string;
  qrTargetUrl: string;
  updatedAt?: string;
}

export interface SiteSettingsFormData {
  whatsappNumber: string;
  phoneNumber: string;
  websiteUrl: string;
  customUrl: string;
  qrDestination: QrDestination;
}
