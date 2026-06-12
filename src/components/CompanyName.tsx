import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

interface CompanyNameProps {
  /** light = white on dark bg, dark = black on light bg, muted = gray for footer, hero = large hero version */
  variant?: 'light' | 'dark' | 'muted' | 'hero';
  className?: string;
  /** Override highlight color class for the brand name (e.g. تام / TAM) */
  highlightClassName?: string;
}

const HERO_YELLOW = 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]';

export default function CompanyName({ variant = 'light', className = '', highlightClassName = 'text-cta' }: CompanyNameProps) {
  const { t } = useTranslation('common');
  const { language } = useLocaleDirection();

  const baseColor =
    variant === 'dark' ? 'text-gray-900' :
      variant === 'muted' ? 'text-gray-400' :
        variant === 'hero' ? 'text-white' :
          'text-white';

  const heroHighlight = highlightClassName === 'text-cta' ? HERO_YELLOW : highlightClassName;

  if (variant === 'hero') {
    if (language === 'ar') {
      return (
        <div className={`flex flex-col items-center ${className}`}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl text-center leading-tight flex items-baseline gap-2 flex-wrap justify-center">
            <span>{t('companyName.prefix')}</span>
            <span className={heroHighlight}>{t('companyName.highlight')}</span>
            <span>{t('companyName.suffix')}</span>
          </h2>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center ${className}`}>
        <span className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl text-center leading-tight">
          <span className={heroHighlight}>{t('companyName.highlight')}</span>
          {t('companyName.suffix')}
        </span>
      </div>
    );
  }

  return (
    <span className={className}>
      <span className={baseColor}>{t('companyName.prefix')}</span>
      <span className={highlightClassName}>{t('companyName.highlight')}</span>
      <span className={baseColor}>{t('companyName.suffix')}</span>
    </span>
  );
}
