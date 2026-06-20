import { useTranslation } from 'react-i18next';
import TamArabicText from './TamArabicText';

export type BrandNameStackSize = 'xs' | 'sm' | 'md' | 'lg' | 'hero';

interface BrandNameStackProps {
  size?: BrandNameStackSize;
  variant?: 'light' | 'dark';
  showMainTam?: boolean;
  align?: 'start' | 'center';
  className?: string;
}

const SIZE = {
  xs: {
    tamMain: 'text-2xl md:text-3xl tracking-[-0.04em]',
    ar: 'text-[11px] md:text-[13px]',
    sub: 'text-[9px] md:text-[10px]',
    gap: 'gap-[3px]',
  },
  sm: {
    tamMain: 'text-3xl md:text-4xl tracking-[-0.04em]',
    ar: 'text-sm md:text-base',
    sub: 'text-[10px] md:text-xs',
    gap: 'gap-0.5',
  },
  md: {
    tamMain: 'text-5xl md:text-6xl tracking-[-0.05em]',
    ar: 'text-base md:text-lg',
    sub: 'text-xs md:text-sm',
    gap: 'gap-1',
  },
  lg: {
    tamMain: 'text-6xl md:text-7xl tracking-[-0.05em]',
    ar: 'text-lg md:text-xl',
    sub: 'text-sm md:text-base',
    gap: 'gap-1',
  },
  hero: {
    tamMain: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.05em]',
    ar: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    sub: 'text-sm sm:text-base md:text-lg lg:text-xl',
    gap: 'gap-1.5 md:gap-2',
  },
} as const;

export default function BrandNameStack({
  size = 'sm',
  variant = 'light',
  showMainTam = false,
  align = 'start',
  className = '',
}: BrandNameStackProps) {
  const { t } = useTranslation('common');
  const s = SIZE[size];
  const base = variant === 'dark' ? 'text-gray-900' : 'text-white';
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-start';

  return (
    <div className={`inline-flex flex-col ${alignClass} ${s.gap} leading-none ${className}`}>
      {showMainTam && (
        <p
          className={`font-montserrat font-extrabold leading-[0.9] brand-wordmark-tam-gradient ${s.tamMain}`}
          dir="ltr"
        >
          TAM
        </p>
      )}

      <p className={`arabic-brand-text whitespace-nowrap inline-flex items-baseline gap-[0.12em] ${s.ar}`} dir="rtl">
        <span className="sr-only">{t('brandName.arHighlight')}</span>
        <TamArabicText />
        <span className={base}>{t('brandName.arSuffix')}</span>
      </p>

      <p className={`font-montserrat font-normal whitespace-nowrap ${s.sub}`} dir="ltr">
        <span className="text-[#FFC107]">{t('brandName.enTam')}</span>
        <span className={base}>{t('brandName.enAlarabiya')}</span>
      </p>
    </div>
  );
}
