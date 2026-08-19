import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import TamArabicText from './TamArabicText';
import ArabiyaText from './ArabiyaText';
import EnglishAlarabiyaText from './EnglishAlarabiyaText';
import { TAM_ARABIC_PLAIN, TAM_ARABIC_WORD_GAP } from '../constants/brandTamArabic';

interface CompanyNameProps {
  variant?: 'light' | 'dark' | 'muted' | 'hero';
  /** Header-only English wordmark: Tam + Alarabiya */
  headerBrand?: boolean;
  /** Allow name to wrap onto multiple lines (e.g. footer) */
  wrap?: boolean;
  className?: string;
  highlightClassName?: string;
}

const HERO_TAM_GOLD = 'brand-tam-hero-gold';

function ArabicHighlight() {
  return (
    <span className="inline-flex items-baseline">
      <span className="sr-only">{TAM_ARABIC_PLAIN}</span>
      <TamArabicText />
    </span>
  );
}

function ArabicNameParts({
  onDark,
  textClass,
  arabicWordGap,
  layoutClass,
}: {
  onDark: boolean;
  textClass: string;
  arabicWordGap: string;
  layoutClass: string;
}) {
  const { t } = useTranslation('common');
  const prefixClass = onDark ? 'text-white' : 'text-gray-900';
  const tailClass = onDark ? 'text-white' : 'text-gray-900';

  return (
    <span
      className={`${textClass} ${layoutClass} items-baseline ${arabicWordGap}`}
      dir="rtl"
    >
      <span className={prefixClass}>{t('companyName.prefix')}</span>
      <ArabicHighlight />
      <ArabiyaText onDark={onDark} />
      <span className={tailClass}>{t('companyName.suffixTail')}</span>
    </span>
  );
}

export default function CompanyName({
  variant = 'light',
  headerBrand = false,
  wrap = false,
  className = '',
  highlightClassName = 'text-cta',
}: CompanyNameProps) {
  const { t } = useTranslation('common');
  const { language } = useLocaleDirection();
  const isArabic = language === 'ar';

  const highlightKey = headerBrand && !isArabic ? 'headerName.highlight' : 'companyName.highlight';
  const suffixKey = headerBrand && !isArabic ? 'headerName.suffix' : 'companyName.suffix';
  const prefixKey = 'companyName.prefix';

  const onDark = variant === 'light' || variant === 'hero';

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

  const englishWordGap = headerBrand ? TAM_ARABIC_WORD_GAP : 'gap-[0.12em]';
  const arabicWordGap = headerBrand ? TAM_ARABIC_WORD_GAP : 'gap-[0.12em]';
  const nowrapClass = headerBrand ? 'whitespace-nowrap' : '';
  const layoutClass = wrap ? 'flex flex-wrap w-full max-w-full' : `inline-flex ${nowrapClass}`;

  if (variant === 'hero') {
    if (isArabic) {
      return (
        <div className={`flex flex-col items-center ${className}`}>
          <ArabicNameParts
            onDark={onDark}
            layoutClass="flex flex-wrap justify-center w-full max-w-full"
            textClass={`${textClass} text-3xl md:text-5xl lg:text-6xl drop-shadow-2xl text-center leading-tight`}
            arabicWordGap={TAM_ARABIC_WORD_GAP}
          />
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
          <span className={onDark ? 'text-white' : 'brand-arabiya-text'}>
            {headerBrand ? (
              <EnglishAlarabiyaText onDark={onDark} />
            ) : (
              t(suffixKey)
            )}
          </span>
        </span>
      </div>
    );
  }

  if (isArabic) {
    return (
      <ArabicNameParts
        onDark={onDark}
        layoutClass={layoutClass}
        textClass={textClass}
        arabicWordGap={arabicWordGap}
      />
    );
  }

  const englishPrefixClass =
    variant === 'muted' ? 'text-gray-400' : onDark ? 'text-white' : 'text-gray-900';

  if (headerBrand) {
    return (
      <span
        className={`${textClass} inline-flex items-baseline ${englishWordGap} ${nowrapClass}`}
        dir="ltr"
      >
        <span className={highlightClassName === 'text-cta' || highlightClassName === 'text-yellow-400' || highlightClassName === 'brand-tam-hero-gold' ? HERO_TAM_GOLD : highlightClassName}>
          {t(highlightKey)}
        </span>
        <EnglishAlarabiyaText onDark={onDark} />
      </span>
    );
  }

  const englishSuffixClass = onDark ? 'text-white' : 'brand-arabiya-text';

  return (
    <span
      className={`${textClass} ${layoutClass} items-baseline ${englishWordGap}`}
      dir="ltr"
    >
      <span className={englishPrefixClass}>{t(prefixKey)}</span>
      <span className={highlightClassName === 'text-cta' || highlightClassName === 'text-yellow-400' || highlightClassName === 'brand-tam-hero-gold' ? HERO_TAM_GOLD : highlightClassName}>
        {t(highlightKey)}
      </span>
      <span className={englishSuffixClass}>{t(suffixKey)}</span>
    </span>
  );
}
