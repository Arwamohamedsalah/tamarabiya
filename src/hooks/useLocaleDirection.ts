import { useTranslation } from 'react-i18next';
import { getDirection, isSupportedLanguage, type SupportedLanguage } from '../i18n';

export function useLocaleDirection() {
  const { i18n } = useTranslation();
  const language: SupportedLanguage = isSupportedLanguage(i18n.language) ? i18n.language : 'ar';
  const dir = getDirection(language);
  const isRtl = dir === 'rtl';

  return { language, dir, isRtl };
}
