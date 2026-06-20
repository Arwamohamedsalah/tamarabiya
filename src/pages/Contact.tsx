import { ArrowRight, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import CompanyName from '../components/CompanyName';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import SeoHead from '../components/SeoHead';
import QrCodeDisplay from '../components/QrCodeDisplay';
import ContactForm from '../components/ContactForm';
import { getImagesByPageAndSection, getImageStyle, getImageWrapperStyle, getDefaultImage } from '../utils/imageUtils';
import { useEffect, useState } from 'react';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

export default function Contact() {
  const { t } = useTranslation(['contact', 'seo']);
  const { isRtl } = useLocaleDirection();
  const images = useAppSelector((state) => state.images.images);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    setImageKey(prev => prev + 1);
  }, [images]);

  useEffect(() => {
    const handleStorageChange = () => {
      setImageKey(prev => prev + 1);
    };
    window.addEventListener('customStorage', handleStorageChange);
    return () => window.removeEventListener('customStorage', handleStorageChange);
  }, []);

  const heroImages = getImagesByPageAndSection(images, 'contact', 'hero');
  const backButtonPosition = isRtl ? 'top-6 right-6' : 'top-6 left-6';
  const backIconClass = isRtl ? '' : 'rotate-180';

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title={t('seo:contact.title')}
        description={t('seo:contact.description')}
        path="/contact"
      />
      <section className="relative h-[60vh] md:h-[70vh] bg-metal overflow-hidden">
        {heroImages.length > 0 && heroImages[0].crop ? (
          <div
            style={{
              ...getImageWrapperStyle(heroImages[0]),
              opacity: 0.6,
            }}
            className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
            key={`${heroImages[0]?.id || 'default-hero'}-${imageKey}`}
            role="img"
            aria-label={t('contact:hero.imageAlt')}
          />
        ) : (
          <img
            src={heroImages.length > 0 ? heroImages[0].url : getDefaultImage('landscaping')}
            alt={heroImages.length > 0 ? heroImages[0].alt : t('contact:hero.imageAlt')}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            style={heroImages.length > 0 ? getImageStyle(heroImages[0]) : {}}
            key={`${heroImages[0]?.id || 'default-hero'}-${imageKey}`}
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cta rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white animate-fade-in-up">
            <p className="text-sm font-medium text-green-300 mb-3 tracking-wider">{t('contact:hero.subtitle')}</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">{t('contact:hero.title')}</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-4"><CompanyName variant="light" /></p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cta to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
        <Link
          to="/"
          className={`absolute ${backButtonPosition} bg-white/90 backdrop-blur-sm p-3 rounded-none hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}
          aria-label={t('contact:hero.backHome')}
        >
          <ArrowRight className={`h-6 w-6 text-gray-900 ${backIconClass}`} />
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="group bg-white rounded-none shadow-xl p-8 md:p-10 text-center hover:shadow-2xl transition-all duration-500 hover-lift border border-gray-100 animate-fade-in-up">
            <div className="bg-gradient-to-br from-cta/20 to-landscape/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Phone className="h-10 w-10 text-cta" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact:phone.title')}</h3>
            <p className="text-gray-600 mb-4 text-sm">{t('contact:phone.subtitle')}</p>
            <div className="flex flex-col gap-2 items-center">
              <a href="tel:0507826024" className="text-cta text-xl font-semibold hover:text-cta-hover transition-colors duration-300">
                0507826024
              </a>
              <a href="tel:0555434360" className="text-cta text-xl font-semibold hover:text-cta-hover transition-colors duration-300">
                0555434360
              </a>
            </div>
          </div>

          <div className="group bg-white rounded-none shadow-xl p-8 md:p-10 text-center hover:shadow-2xl transition-all duration-500 hover-lift border border-gray-100 animate-fade-in-up animate-delay-100">
            <div className="bg-gradient-to-br from-cta/20 to-landscape/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Globe className="h-10 w-10 text-cta" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact:website.title')}</h3>
            <p className="text-gray-600 mb-4 text-sm">{t('contact:website.subtitle')}</p>
            <a
              href="https://www.tamalarabiya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cta text-lg font-semibold hover:text-cta-hover transition-all duration-300 hover:scale-105 inline-block break-all"
            >
              www.tamalarabiya.com
            </a>
          </div>

          <div className="group bg-white rounded-none shadow-xl p-8 md:p-10 text-center hover:shadow-2xl transition-all duration-500 hover-lift border border-gray-100 md:col-span-2 lg:col-span-1 animate-fade-in-up animate-delay-200">
            <div className="bg-gradient-to-br from-cta/20 to-landscape/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="h-10 w-10 text-cta" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact:address.title')}</h3>
            <p className="text-gray-600 mb-4 text-sm">{t('contact:address.subtitle')}</p>
            <div className="space-y-2">
              <p className="text-gray-700 text-lg font-medium">
                {t('contact:address.country')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 max-w-2xl mx-auto">
          <ContactForm />
        </div>

        <QrCodeDisplay />

        <div className="mt-16 md:mt-24">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('contact:social.title')}
            </h2>
            <p className="text-gray-600 mb-2 text-lg">
              {t('contact:social.subtitle')}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cta to-transparent mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { icon: Facebook, color: 'bg-blue-600', bgColor: 'bg-blue-100', textColor: 'text-blue-600', label: 'Facebook' },
              { icon: Twitter, color: 'bg-sky-500', bgColor: 'bg-sky-100', textColor: 'text-sky-500', label: 'Twitter' },
              { icon: Instagram, color: 'bg-pink-600', bgColor: 'bg-pink-100', textColor: 'text-pink-600', label: 'Instagram' },
              { icon: Linkedin, color: 'bg-blue-700', bgColor: 'bg-blue-100', textColor: 'text-blue-700', label: 'LinkedIn' },
              { icon: Youtube, color: 'bg-red-600', bgColor: 'bg-red-100', textColor: 'text-red-600', label: 'YouTube' },
            ].map((social, index) => (
              <a
                key={social.label}
                href="#"
                className="group bg-white rounded-none shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover-lift flex flex-col items-center gap-3 min-w-[140px] border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                aria-label={social.label}
              >
                <div className={`${social.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <social.icon className={`h-8 w-8 ${social.textColor}`} />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-cta transition-colors duration-300">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-none shadow-xl p-8 md:p-12 text-center hover:shadow-2xl transition-all duration-500 border border-gray-200 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <CompanyName variant="dark" />
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('contact:companyCard.tagline')}
            </p>
            <div className="space-y-3 text-lg text-gray-700 mb-8">
              <p className="font-medium">{t('contact:companyCard.servicesAr')}</p>
              <p className="text-gray-600">{t('contact:companyCard.servicesEn')}</p>
            </div>
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-500">{t('contact:companyCard.copyright')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
