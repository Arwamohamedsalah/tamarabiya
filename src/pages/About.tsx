import { useTranslation } from 'react-i18next';
import SeoHead from '../components/SeoHead';
import PageHeader from '../components/PageHeader';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

export default function About() {
  const { t, i18n } = useTranslation(['about', 'seo']);
  const { isRtl } = useLocaleDirection();
  const isArabic = i18n.language === 'ar';
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const borderSide = isRtl ? 'border-r-4' : 'border-l-4';

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
        <div className="grid md:grid-cols-1 gap-8 md:gap-12 mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-none shadow-xl p-8 md:p-12 hover:shadow-2xl transition-all duration-500 hover-lift animate-fade-in-up border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-gradient-to-b from-infra via-landscape to-metal rounded-full"></div>
              <h2 className={`text-3xl md:text-4xl font-black text-gray-900 ${textAlign}`}>
                {t('about:specializations.titlePrefix')}
                <span className="text-yellow-400">{t('about:specializations.titleHighlight')}</span>
                {t('about:specializations.titleSuffix')}
              </h2>
            </div>
            <ul className={`space-y-6 ${textAlign} text-gray-700 leading-relaxed text-lg`}>
              {specializationItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-landscape/20 to-metal/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-landscape-dark font-bold text-xl">•</span>
                  </div>
                  <span className="group-hover:text-infra transition-colors duration-300">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className={`${textAlign} text-gray-700 leading-relaxed text-lg`}>
                {t('about:specializations.paragraph1')}
              </p>
              <p className={`mt-4 ${textAlign} text-gray-700 leading-relaxed text-lg`}>
                {t('about:specializations.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about:visionMission.title')}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cta to-transparent mx-auto rounded-full"></div>
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
                  <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 ${textAlign}`}>{item.title}</h3>
                </div>
                <p className={`${textAlign} text-gray-700 leading-relaxed text-lg`}>{item.text}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('about:companyVision.title')}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-1 gap-8 md:gap-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-none border border-white/20 hover:bg-white/15 transition-all duration-500 hover-lift shadow-xl animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <h3 className={`text-xl font-semibold ${textAlign}`}>{t('about:companyVision.heading')}</h3>
              </div>
              <p className={`text-lg md:text-xl leading-relaxed ${textAlign}`}>
                {t('about:companyVision.paragraph1')}
              </p>
              <p className={`text-lg md:text-xl leading-relaxed ${textAlign} mt-6`}>
                {t('about:companyVision.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
