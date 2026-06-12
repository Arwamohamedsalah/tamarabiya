import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arCommon from '../locales/ar/common.json';
import enCommon from '../locales/en/common.json';
import arHome from '../locales/ar/home.json';
import enHome from '../locales/en/home.json';
import arAbout from '../locales/ar/about.json';
import enAbout from '../locales/en/about.json';
import arContact from '../locales/ar/contact.json';
import enContact from '../locales/en/contact.json';
import arServices from '../locales/ar/services.json';
import enServices from '../locales/en/services.json';
import arValidation from '../locales/ar/validation.json';
import enValidation from '../locales/en/validation.json';
import arSeo from '../locales/ar/seo.json';
import enSeo from '../locales/en/seo.json';

export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar';
export const LANGUAGE_STORAGE_KEY = 'tam-language';

export function isSupportedLanguage(lang: string | undefined | null): lang is SupportedLanguage {
  return lang === 'ar' || lang === 'en';
}

export function getDirection(lang: SupportedLanguage): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        common: arCommon,
        home: arHome,
        about: arAbout,
        contact: arContact,
        services: arServices,
        validation: arValidation,
        seo: arSeo,
      },
      en: {
        common: enCommon,
        home: enHome,
        about: enAbout,
        contact: enContact,
        services: enServices,
        validation: enValidation,
        seo: enSeo,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultNS: 'common',
    ns: ['common', 'home', 'about', 'contact', 'services', 'validation', 'seo'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
