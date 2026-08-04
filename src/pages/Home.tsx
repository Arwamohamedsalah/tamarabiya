import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import SeoHead from '../components/SeoHead';
import { getDefaultImage, getHomeServiceImages, getImagesByPageAndSection } from '../utils/imageUtils';
import CroppedImage from '../components/CroppedImage';
import { useEffect, useMemo, useState } from 'react';
import ServiceCardWithSlider from '../components/ServiceCardWithSlider';
import TamArabicText from '../components/TamArabicText';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

export default function Home() {
  const { t } = useTranslation(['home', 'seo']);
  const { language } = useLocaleDirection();
  const images = useAppSelector((state) => state.images.images);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'https://tamarabiya.com'}/api/download-profile`;
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  const landscapingImages = getHomeServiceImages(images, 'landscaping');
  const fencingImages = getHomeServiceImages(images, 'fencing');
  const infrastructureImages = getHomeServiceImages(images, 'infrastructure');

  const services = useMemo(() => [
    {
      id: 'landscaping',
      title: t('home:services.landscaping.title'),
      titleEn: t('home:services.landscaping.titleEn'),
      description: t('home:services.landscaping.description'),
      defaultImage: getDefaultImage('landscaping'),
      link: '/landscaping',
      images: landscapingImages,
    },
    {
      id: 'fencing',
      title: t('home:services.fencing.title'),
      titleEn: t('home:services.fencing.titleEn'),
      description: t('home:services.fencing.description'),
      defaultImage: getDefaultImage('fencing'),
      link: '/fencing',
      images: fencingImages,
    },
    {
      id: 'infrastructure',
      title: t('home:services.infrastructure.title'),
      titleEn: t('home:services.infrastructure.titleEn'),
      description: t('home:services.infrastructure.description'),
      defaultImage: getDefaultImage('infrastructure'),
      link: '/infrastructure',
      images: infrastructureImages,
    },
  ], [t, landscapingImages, fencingImages, infrastructureImages]);

  const heroImages = getImagesByPageAndSection(images, 'home', 'hero');
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const stats = [
    { number: t('home:stats.years.number'), label: t('home:stats.years.label'), subtitle: t('home:stats.years.subtitle'), icon: Globe },
    { number: t('home:stats.projects.number'), label: t('home:stats.projects.label'), subtitle: t('home:stats.projects.subtitle'), icon: FileText },
    { number: t('home:stats.quality.number'), label: t('home:stats.quality.label'), subtitle: t('home:stats.quality.subtitle'), icon: ArrowRight }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title={t('seo:home.title')}
        description={t('seo:home.description')}
      />

      <section className={`relative h-[70vh] flex items-center justify-center overflow-hidden ${heroImages.length > 0 ? 'bg-metal-dark' : 'mesh-bg grain'}`}>
        <div className="absolute inset-0 z-0">
          {heroImages.length > 0 ? (
            heroImages.map((img, idx) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === heroIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <CroppedImage
                  image={img}
                  alt={img.alt || t('home:hero.backgroundAlt')}
                  className="w-full h-full"
                  uncroppedClassName="w-full h-full object-cover"
                  fit="cover"
                />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-metal-dark/20" />
          )}
        </div>

        {heroImages.length === 0 && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cta/20 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-landscape/10 rounded-full blur-[120px] animate-float-reverse"></div>
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
        )}

        <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 md:pt-28">
          <div className="animate-fade-in-up">
            <div className="mb-2 lg:mb-4 flex flex-col items-center gap-1 md:gap-2 text-center">
              <div className="flex flex-col items-center" dir="ltr">
                <h2 className="font-montserrat english-brand-text font-semibold tracking-[0.045em] leading-[1] mb-1 inline-flex items-baseline justify-center gap-[0.28em] flex-wrap">
                  <span className="text-5xl md:text-6xl lg:text-7xl brand-tam-hero-gold">
                    {t('home:hero.brandTam')}
                  </span>
                  <span className="text-2xl md:text-3xl lg:text-4xl text-white">
                    {t('home:hero.brandAlarabiya')}
                  </span>
                </h2>
                <span className="font-montserrat english-brand-text text-[10px] md:text-xs lg:text-sm font-bold text-white/90 uppercase tracking-[0.6em] mb-1">
                  {t('home:hero.brandSubtitle')}
                </span>
              </div>

              {language === 'ar' && (
                <>
                  <div className="w-10 h-1 bg-yellow-400 opacity-60 my-1 mx-auto" />
                  <h2 className="font-arabic arabic-brand-text text-lg md:text-xl lg:text-2xl leading-[1] mb-1 inline-flex items-baseline justify-center gap-1 flex-wrap" dir="rtl">
                    <span className="text-white">{t('home:hero.brandPrefix')}</span>
                    <TamArabicText />
                    <span className="text-white/95">{t('home:hero.brandSuffix')}</span>
                  </h2>
                </>
              )}
            </div>

            <div className="mb-8 animate-fade-in-up animate-delay-200 text-center items-center flex flex-col gap-1">
              <p className="font-montserrat text-[10px] md:text-xs text-white/80 font-bold tracking-[0.5em] uppercase">
                {t('home:hero.taglineEn')}
              </p>
              {language === 'ar' && (
                <p className="font-arabic arabic-brand-text text-sm md:text-lg text-yellow-400 font-bold opacity-90 tracking-wider">
                  {t('home:hero.taglineAr')}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-delay-300">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center justify-center bg-yellow-400 text-white px-12 py-5 rounded-none font-bold text-sm md:text-base transition-all duration-300 hover:bg-yellow-500 hover:shadow-xl w-full sm:w-auto min-w-[240px] md:min-w-[280px] uppercase tracking-[0.2em] disabled:opacity-75 relative group overflow-hidden shadow-lg"
              >
                <div className={`transition-all duration-500 flex items-center gap-2 ${isDownloading ? 'opacity-0 scale-90 translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`}>
                  <Download className="h-5 w-5" />
                  <span>{t('home:hero.downloadProfile')}</span>
                </div>
                {isDownloading && (
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <Download className="h-6 w-6 animate-bounce" />
                  </div>
                )}
              </button>

              <Link
                to="/about"
                className="inline-flex items-center justify-center border-2 border-yellow-400 bg-transparent text-yellow-400 px-12 py-5 rounded-none font-bold text-sm md:text-base transition-all duration-300 hover:bg-yellow-400 hover:text-white w-full sm:w-auto min-w-[240px] md:min-w-[280px] uppercase tracking-[0.2em]"
              >
                {t('home:hero.whoWeAre')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-30 mt-0 bg-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 grain overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-64 bg-gray-50/80 skew-x-[-15deg] translate-x-32 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">{t('home:services.expertise')}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-metal mb-6">
              {t('home:services.title')}
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-none"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCardWithSlider
                key={service.id}
                id={service.id}
                title={service.title}
                titleEn={service.titleEn}
                description={service.description}
                link={service.link}
                images={service.images}
                defaultImage={service.defaultImage}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-metal text-white py-20 relative overflow-hidden mesh-bg grain">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cta/10 rounded-full blur-[120px] animate-float"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{t('home:stats.title')}</h2>
            <div className="w-16 h-1 bg-cta mx-auto rounded-none"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative glass-card-dark p-8 rounded-none hover:bg-white/10 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl border border-white/5 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-cta/10 rounded-full -translate-y-12 translate-x-12 blur-3xl transition-transform duration-700 group-hover:scale-150"></div>

                <div className="relative z-10 w-full">
                  <div className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-cta transition-colors duration-500">
                    {stat.number}
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-cta-light">{stat.label}</p>
                    {language === 'ar' && (
                      <p className="text-metal-silver text-[9px] uppercase tracking-[0.4em] opacity-40 font-black">{stat.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
