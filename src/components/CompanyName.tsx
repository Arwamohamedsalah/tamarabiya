import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import TamArabicText from './TamArabicText';

interface CompanyNameProps {
  variant?: 'light' | 'dark' | 'muted' | 'hero';
  /** Header-only English wordmark: Tam + Alarabiya */
  headerBrand?: boolean;
  className?: string;
  highlightClassName?: string;
}

const HERO_TAM_GOLD = 'brand-tam-hero-gold';

function ArabicHighlight() {
  const { t } = useTranslation('common');

  return (
    <span className="inline-flex items-baseline">
      <span className="sr-only">{t('companyName.highlight')}</span>
      <TamArabicText />
    </span>
  );
}

export default function CompanyName({
  variant = 'light',
  headerBrand = false,
  className = '',
  highlightClassName = 'text-cta',
}: CompanyNameProps) {
  const { t } = useTranslation('common');
  const { language } = useLocaleDirection();
  const isArabic = language === 'ar';

  const highlightKey = headerBrand && !isArabic ? 'headerName.highlight' : 'companyName.highlight';
  const suffixKey = headerBrand && !isArabic ? 'headerName.suffix' : 'companyName.suffix';
  const prefixKey = 'companyName.prefix';

  const baseColor =
    variant === 'dark'
      ? 'text-gray-900'
      : variant === 'muted'
        ? 'text-gray-400'
        : variant === 'hero'
          ? 'text-white'
          : 'text-white';

  const textClass = isArabic
    ? `font-arabic arabic-brand-text ${className}`
    : `font-montserrat english-brand-text tracking-[0.035em] ${className}`;

  const englishWordGap = 'gap-[0.28em]';

  if (variant === 'hero') {
    if (isArabic) {
      return (
        <div className={`flex flex-col items-center ${className}`}>
          <h2
            className={`${textClass} text-3xl md:text-5xl lg:text-6xl text-white drop-shadow-2xl text-center leading-tight inline-flex items-baseline gap-1 flex-wrap justify-center`}
            dir="rtl"
          >
            <span>{t(prefixKey)}</span>
            <ArabicHighlight />
            <span>{t(suffixKey)}</span>
          </h2>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center ${className}`}>
        <span
          className={`${textClass} text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-2xl text-center leading-tight inline-flex items-baseline justify-center flex-wrap ${englishWordGap}`}
          dir="ltr"
        >
          <span className={highlightClassName === 'text-cta' ? HERO_TAM_GOLD : highlightClassName}>
            {t(highlightKey)}
          </span>
          <span>{t(suffixKey)}</span>
        </span>
      </div>
    );
  }

  return (
    <span
      className={`${textClass} inline-flex items-baseline ${isArabic ? 'gap-[0.06em]' : englishWordGap}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <span className={baseColor}>{t(prefixKey)}</span>
      {isArabic ? (
        <ArabicHighlight />
      ) : (
        <span className={highlightClassName === 'text-cta' || highlightClassName === 'text-yellow-400' || highlightClassName === 'brand-tam-hero-gold' ? HERO_TAM_GOLD : highlightClassName}>
          {t(highlightKey)}
        </span>
      )}
      <span className={baseColor}>{t(suffixKey)}</span>
    </span>
  );
}
