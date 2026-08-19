import { useTranslation } from 'react-i18next';
import SeoHead from '../components/SeoHead';
import PageHeader from '../components/PageHeader';
import TamArabicText from '../components/TamArabicText';
import ArabiyaText from '../components/ArabiyaText';
import EnglishAlarabiyaText from '../components/EnglishAlarabiyaText';
import { TAM_ARABIC_WORD_GAP } from '../constants/brandTamArabic';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

export default function About() {
  const { t } = useTranslation(['about', 'seo']);
  const { isRtl, language } = useLocaleDirection();
  const isArabic = language === 'ar';
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const borderSide = isRtl ? 'border-r-4' : 'border-l-4';
  const textFont = isArabic ? 'font-arabic arabic-brand-text' : 'font-montserrat';
  const bodyText = `text-gray-700 leading-relaxed text-base md:text-lg ${textFont}`;
  const sectionTitle = `text-xl md:text-2xl font-black text-gray-900 ${textFont}`;
  const pageTitle = `text-2xl md:text-3xl font-black text-gray-900 ${textFont}`;
  const cardTitle = `text-lg md:text-xl font-bold text-gray-900 ${textFont}`;

  const specializationItems = t('about:specializations.items', { returnObjects: true }) as string[];

  const visionItems = [
    { title: t('about:visionMission.planning.title'), text: t('about:visionMission.planning.text') },
    { title: t('about:visionMission.resources.title'), text: t('about:visionMission.resources.text') },
    { title: t('about:visionMission.workflow.title'), text: t('about:visionMission.workflow.text') },
    { title: t('about:visionMission.delivery.title'), text: t('about:visionMission.delivery.text') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 grain">
      <SeoHead
        title={t('seo:about.title')}
        description={t('seo:about.description')}
        path="/about"
      />

      <PageHeader
        title={t('seo:about.title')}
        titleEn={isArabic ? '' : t('seo:pageHeader.aboutTitleEn')}
        accentColor="cta"
        showCompanyName={true}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-16 max-w-5xl mx-auto animate-fade-in-up">
          <div className="bg-white rounded-none shadow-xl p-8 md:p-12 border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 bg-gradient-to-b from-landscape to-landscape-dark rounded-full"></div>
              <h2 className={`${sectionTitle} ${textAlign}`}>
                {isArabic ? (
                  <>
                    نطمح في{' '}
                    <span className={`inline-flex items-baseline ${TAM_ARABIC_WORD_GAP}`}>
                      <TamArabicText />
                      <ArabiyaText />
                    </span>
                  </>
                ) : (
                  <>
                    We aspire in{' '}
                    <span className={`inline-flex items-baseline ${TAM_ARABIC_WORD_GAP}`}>
                      <span className="brand-tam-hero-gold">TAM</span>
                      <EnglishAlarabiyaText uppercase />
                    </span>
                  </>
                )}
              </h2>
            </div>
            {isArabic ? (
              <p className={`${textAlign} ${bodyText}`}>
                {t('about:companyIntro.paragraphAr')}
              </p>
            ) : (
              <div className={`space-y-6 ${textAlign}`}>
                <p className={bodyText}>
                  {t('about:companyIntro.paragraphEn1')}
                </p>
                <p className={bodyText}>
                  {t('about:companyIntro.paragraphEn2')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-8 md:gap-12 mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-none shadow-xl p-8 md:p-12 hover:shadow-2xl transition-all duration-500 hover-lift animate-fade-in-up border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-10 bg-gradient-to-b from-infra via-landscape to-metal rounded-full"></div>
              <h2 className={`${sectionTitle} ${textAlign} inline-flex items-baseline flex-wrap ${TAM_ARABIC_WORD_GAP}`}>
                {isArabic ? (
                  <>
                    {t('about:specializations.titlePrefix')}
                    <TamArabicText />
                    {t('about:specializations.titleSuffix')}
                  </>
                ) : (
                  <>
                    <span className="brand-tam-hero-gold">{t('about:specializations.titleHighlight')}</span>
                    <EnglishAlarabiyaText />
                    <span>{t('about:specializations.titleSuffix')}</span>
                  </>
                )}
              </h2>
            </div>
            <ul className={`space-y-6 ${textAlign} ${bodyText}`}>
              {specializationItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-landscape/20 to-metal/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-landscape-dark font-bold text-lg">•</span>
                  </div>
                  <span className="group-hover:text-infra transition-colors duration-300">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className={`${textAlign} ${bodyText}`}>
                {t('about:specializations.paragraph1')}
              </p>
              <p className={`mt-4 ${textAlign} ${bodyText}`}>
                {t('about:specializations.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className={`${pageTitle} mb-4`}>
              {t('about:visionMission.title')}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cta to-transparent mx-auto rounded-none"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {visionItems.map((item, index) => (
              <div
                key={item.title}
                className={`bg-white rounded-none shadow-lg p-8 md:p-10 hover:shadow-xl transition-all duration-500 hover-lift ${borderSide} border-cta animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-cta rounded-full"></div>
                  <h3 className={`${cardTitle} ${textAlign}`}>{item.title}</h3>
                </div>
                <p className={`${textAlign} ${bodyText}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-metal via-metal-dark to-metal text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-landscape rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${textFont}`}>
              {t('about:companyVision.title')}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-none"></div>
          </div>
          <div className="grid md:grid-cols-1 gap-8 md:gap-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-none border border-white/20 hover:bg-white/15 transition-all duration-500 hover-lift shadow-xl animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <h3 className={`${cardTitle} text-white ${textAlign}`}>{t('about:companyVision.heading')}</h3>
              </div>
              <p className={`${bodyText} text-white/90 ${textAlign}`}>
                {t('about:companyVision.paragraph1')}
              </p>
              <p className={`${bodyText} text-white/90 ${textAlign} mt-6`}>
                {t('about:companyVision.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
