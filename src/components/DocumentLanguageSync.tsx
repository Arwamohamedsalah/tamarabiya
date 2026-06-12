import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDirection, isSupportedLanguage } from '../i18n';

export default function DocumentLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyDocumentLanguage = (lang: string) => {
      const language = isSupportedLanguage(lang) ? lang : 'ar';
      const dir = getDirection(language);
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    };

    applyDocumentLanguage(i18n.language);
    i18n.on('languageChanged', applyDocumentLanguage);

    return () => {
      i18n.off('languageChanged', applyDocumentLanguage);
    };
  }, [i18n]);

  return null;
}
