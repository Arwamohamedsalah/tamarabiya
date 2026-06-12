import type { TFunction } from 'i18next';
import type { PageContentData, ServiceType } from '../store/slices/pageContentSlice';
import type { SupportedLanguage } from '../i18n';

interface LocalizedPageDefaults {
  introTitle: string;
  introTitleEn: string;
  introDescription: string;
  introDescriptionEn: string;
  ctaTitle: string;
  ctaTitleEn: string;
  ctaDescription: string;
  ctaDescriptionEn: string;
  ctaButtonText: string;
  ctaButtonTextEn: string;
  serviceTypes: ServiceType[];
}

export function resolvePageContent(
  content: PageContentData | null | undefined,
  language: SupportedLanguage,
  defaults: LocalizedPageDefaults
) {
  const isEn = language === 'en';

  return {
    introTitle: isEn
      ? content?.introTitleEn || defaults.introTitleEn
      : content?.introTitle || defaults.introTitle,
    introDescription: isEn
      ? content?.introDescriptionEn || defaults.introDescriptionEn
      : content?.introDescription || defaults.introDescription,
    ctaTitle: isEn
      ? content?.ctaTitleEn || defaults.ctaTitleEn
      : content?.ctaTitle || defaults.ctaTitle,
    ctaDescription: isEn
      ? content?.ctaDescriptionEn || defaults.ctaDescriptionEn
      : content?.ctaDescription || defaults.ctaDescription,
    ctaButtonText: isEn
      ? content?.ctaButtonTextEn || defaults.ctaButtonTextEn
      : content?.ctaButtonText || defaults.ctaButtonText,
    serviceTypes: (content?.serviceTypes?.length ? content.serviceTypes : defaults.serviceTypes).map(
      (type, index) => localizeServiceType(type, language, defaults.serviceTypes[index])
    ),
  };
}

function localizeServiceType(
  type: ServiceType,
  language: SupportedLanguage,
  fallback?: ServiceType
): ServiceType {
  const isEn = language === 'en';
  return {
    ...type,
    name: isEn ? type.name || fallback?.name || '' : type.nameAr || fallback?.nameAr || type.name,
    nameAr: type.nameAr || fallback?.nameAr || '',
    desc: isEn ? type.descEn || fallback?.descEn || type.desc : type.desc || fallback?.desc || '',
  };
}

export function getLocalizedServiceTypeDisplay(
  type: ServiceType,
  language: SupportedLanguage
): { label: string; subtitle: string; description: string } {
  const isEn = language === 'en';
  return {
    label: isEn ? type.name : type.nameAr,
    subtitle: isEn ? type.nameAr : type.name,
    description: type.desc,
  };
}

export function getProjectName(
  alt: string | undefined,
  index: number,
  t: TFunction<'services'>
): string {
  return alt || t('projectFallback', { number: index + 1 });
}
