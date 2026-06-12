import { useTranslation } from 'react-i18next';
import { isSupportedLanguage } from '../i18n';

interface LanguageSwitcherProps {
  className?: string;
  onSwitch?: () => void;
}

export default function LanguageSwitcher({ className = '', onSwitch }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  const currentLang = isSupportedLanguage(i18n.language) ? i18n.language : 'ar';
  const nextLang = currentLang === 'ar' ? 'en' : 'ar';

  const handleSwitch = () => {
    i18n.changeLanguage(nextLang);
    onSwitch?.();
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className={`text-metal-silver hover:text-white font-black text-xs uppercase tracking-[0.25em] border border-white/20 px-3 py-2 transition-all duration-300 hover:border-yellow-400/60 hover:text-yellow-400 focus:outline-none min-w-[44px] text-center ${className}`}
      aria-label={nextLang === 'en' ? t('aria.switchToEnglish') : t('aria.switchToArabic')}
      lang={nextLang}
    >
      {t('languageSwitcher')}
    </button>
  );
}
