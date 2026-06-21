import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CompanyName from './CompanyName';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ArrowLeft, MapPin } from 'lucide-react';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import { CONTACT_EMAILS } from '../config/contactEmails';

export default function Footer() {
  const { t } = useTranslation('common');
  const { isRtl } = useLocaleDirection();
  const currentYear = new Date().getFullYear();
  const hijriYear = currentYear - 621;

  const textAlign = isRtl ? 'text-center lg:text-right' : 'text-center lg:text-left';
  const flexAlign = isRtl ? 'justify-center lg:justify-start' : 'justify-center lg:justify-start';
  const arrowClass = isRtl
    ? 'h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 hidden lg:block'
    : 'h-4 w-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 hidden lg:block rotate-180';

  return (
    <footer className="bg-metal pt-20 pb-10 relative overflow-hidden grain text-white">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cta to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-12">
          <div className={`col-span-2 lg:col-span-1 space-y-8 ${textAlign} mb-12 lg:mb-0`}>
            <Link to="/" className={`flex items-center gap-4 group ${flexAlign}`}>
              <div className="w-16 h-16 bg-white rounded-none p-2 shadow-2xl transition-transform duration-500 group-hover:rotate-6">
                <img src="/tam.png" alt={t('aria.logoAlt')} className="w-full h-full object-contain" />
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <p className="text-lg md:text-xl leading-tight">
                  <CompanyName variant="light" highlightClassName="brand-tam-hero-gold" />
                </p>
                <p className="font-montserrat english-brand-text text-[10px] md:text-xs text-metal-silver uppercase tracking-[0.3em] opacity-40 mt-0.5">
                  {t('tagline')}
                </p>
              </div>
            </Link>
            <p className="text-metal-silver text-base lg:text-lg leading-relaxed opacity-80 max-w-sm mx-auto lg:mx-0">
              {t('footer.description')}
            </p>
            <div className={`flex gap-4 ${flexAlign}`}>
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' }
              ].map((social) => (
                <a key={social.label} href="#" className="w-10 h-10 lg:w-12 lg:h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cta hover:border-cta transition-all duration-300 group">
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="w-5 h-5 text-metal-silver group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className={textAlign}>
            <h3 className={`text-lg lg:text-xl font-black mb-8 text-white flex items-center gap-3 ${flexAlign}`}>
              <div className="w-1.5 h-7 bg-cta rounded-none"></div>
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-5">
              {[
                { to: '/', label: t('footer.links.home') },
                { to: '/about', label: t('footer.links.about') },
                { to: '/contact', label: t('footer.links.contact') },
                { to: '/infrastructure', label: t('footer.links.infrastructure') },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`text-metal-silver text-base lg:text-lg hover:text-cta transition-colors duration-300 flex items-center gap-3 group ${flexAlign}`}>
                    <ArrowLeft className={arrowClass} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={textAlign}>
            <h3 className={`text-lg lg:text-xl font-black mb-8 text-white flex items-center gap-3 ${flexAlign}`}>
              <div className="w-1.5 h-7 bg-landscape rounded-none"></div>
              {t('footer.services')}
            </h3>
            <ul className="space-y-5">
              {[
                { to: '/landscaping', label: t('footer.links.landscaping') },
                { to: '/fencing', label: t('footer.links.fencing') },
                { to: '/infrastructure', label: t('footer.links.contracting') },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`text-metal-silver text-base lg:text-lg hover:text-landscape transition-colors duration-300 flex items-center gap-3 group ${flexAlign}`}>
                    <ArrowLeft className={arrowClass} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`col-span-2 lg:col-span-1 ${textAlign} pt-8 lg:pt-0 border-t border-white/5 lg:border-none`}>
            <h3 className={`text-lg lg:text-xl font-black mb-8 text-white flex items-center gap-3 ${flexAlign}`}>
              <div className="w-1.5 h-7 bg-infra rounded-none"></div>
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-8">
              <li className={`flex flex-col lg:flex-row items-center lg:items-start gap-4 group ${isRtl ? '' : 'lg:flex-row'}`}>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-infra transition-colors shrink-0">
                  <Phone className="h-5 w-5 text-metal-silver group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-metal-silver uppercase tracking-widest opacity-40 mb-1">{t('footer.callUs')}</p>
                  <a href="tel:+966507826024" className="text-base lg:text-lg font-bold hover:text-cta transition-colors block" dir="ltr">+966 50 782 6024</a>
                </div>
              </li>
              <li className={`flex flex-col lg:flex-row items-center lg:items-start gap-4 group`}>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-cta transition-colors shrink-0">
                  <Mail className="h-5 w-5 text-metal-silver group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-metal-silver uppercase tracking-widest opacity-40 mb-1">{t('footer.email')}</p>
                  <a href={`mailto:${CONTACT_EMAILS.info}`} className="text-base lg:text-lg font-bold hover:text-cta transition-colors block break-all">{CONTACT_EMAILS.info}</a>
                  <a href={`mailto:${CONTACT_EMAILS.sales}`} className="text-base lg:text-lg font-bold hover:text-cta transition-colors block break-all mt-1">{CONTACT_EMAILS.sales}</a>
                </div>
              </li>
              <li className={`flex flex-col lg:flex-row items-center lg:items-start gap-4 group`}>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-landscape transition-colors shrink-0">
                  <MapPin className="h-5 w-5 text-metal-silver group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-metal-silver uppercase tracking-widest opacity-40 mb-1">{t('footer.location')}</p>
                  <a
                    href="https://maps.google.com/?q=شركة+تام+العربية+للمقاولات"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base lg:text-lg font-bold hover:text-landscape transition-colors block"
                  >
                    {t('footer.locationValue')}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <p className="text-sm font-medium">
            {t('footer.copyright', { year: currentYear, hijriYear })}
          </p>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
