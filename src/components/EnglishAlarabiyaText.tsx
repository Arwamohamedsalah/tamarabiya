import { useTranslation } from 'react-i18next';

interface EnglishAlarabiyaTextProps {
  /** Dark page background — use light text */
  onDark?: boolean;
  uppercase?: boolean;
  className?: string;
}

/** «Alarabiya» — black on light backgrounds, white on dark */
export default function EnglishAlarabiyaText({
  onDark = false,
  uppercase = false,
  className = '',
}: EnglishAlarabiyaTextProps) {
  const { t } = useTranslation('common');
  const colorClass = onDark ? 'text-white' : 'brand-arabiya-text';
  const label = t('companyName.arabiya').trim();

  return (
    <span className={`${colorClass} ${className}`.trim()}>
      {uppercase ? label.toUpperCase() : label}
    </span>
  );
}
