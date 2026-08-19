import { useTranslation } from 'react-i18next';

interface ArabiyaTextProps {
  /** Dark page background — use light text */
  onDark?: boolean;
  className?: string;
}

/** «العربيـــــة» — black on light backgrounds, white on dark */
export default function ArabiyaText({ onDark = false, className = '' }: ArabiyaTextProps) {
  const { t } = useTranslation('common');
  const colorClass = onDark ? 'text-white' : 'brand-arabiya-text';

  return (
    <span className={`${colorClass} ${className}`.trim()}>{t('companyName.arabiya')}</span>
  );
}
