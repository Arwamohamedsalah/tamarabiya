import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { isSupportedLanguage } from '../i18n';

const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
const OG_IMAGE_URL = `${SITE_URL}/tam.png`;

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export default function SeoHead({ title, description, path = '/', image = OG_IMAGE_URL }: SeoHeadProps) {
  const { i18n, t } = useTranslation('seo');
  const language = isSupportedLanguage(i18n.language) ? i18n.language : 'ar';
  const url = `${SITE_URL}${path}`;
  const siteName = t('siteName');
  const fullTitle = path === '/' ? title : `${title} | ${siteName}`;
  const ogLocale = language === 'ar' ? 'ar_SA' : 'en_US';
  const alternateLocale = language === 'ar' ? 'en_US' : 'ar_SA';

  return (
    <Helmet htmlAttributes={{ lang: language, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang={language} href={url} />
      <link rel="alternate" hrefLang={language === 'ar' ? 'en' : 'ar'} href={url} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={alternateLocale} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
