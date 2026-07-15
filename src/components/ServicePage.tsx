import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { Play } from 'lucide-react';
import { setPageContent } from '../store/slices/pageContentSlice';
import SeoHead from '../components/SeoHead';
import PageHeader from '../components/PageHeader';
import VideoModal from '../components/VideoModal';
import { getImagesByPageAndSection, getImageWrapperStyle, getWorkAreaImages } from '../utils/imageUtils';
import { resolvePageContent, getProjectName } from '../utils/localizedContent';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import WorkAreaSections from './WorkAreaSections';
import landscapingWorkAreas from '../content/landscapingWorkAreas.json';
import fencingWorkAreas from '../content/fencingWorkAreas.json';
import infrastructureWorkAreas from '../content/infrastructureWorkAreas.json';
import type { WorkAreaSection } from '../types/workAreaSection';
import type { PageContentData } from '../store/slices/pageContentSlice';

import { API_BASE_URL } from '../config/api';

type ServicePageKey = 'landscaping' | 'fencing' | 'infrastructure';

const DEFAULT_WORK_AREAS: Record<ServicePageKey, WorkAreaSection[]> = {
  landscaping: landscapingWorkAreas as WorkAreaSection[],
  fencing: fencingWorkAreas as WorkAreaSection[],
  infrastructure: infrastructureWorkAreas as WorkAreaSection[],
};

interface ServicePageProps {
  pageKey: ServicePageKey;
  accentColor: 'landscape' | 'metal' | 'infra';
  ctaGradient: string;
  ctaTextColor: string;
}

export default function ServicePage({ pageKey, accentColor, ctaGradient, ctaTextColor }: ServicePageProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('services');
  const { language, isRtl } = useLocaleDirection();
  const images = useAppSelector((state) => state.images.images);
  const content = useAppSelector((state) => state.pageContent.byPage[pageKey]);

  const [imageKey, setImageKey] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const pageDefaults = useMemo(() => {
    const defaults = t(`${pageKey}.defaultTypes`, { returnObjects: true }) as Array<{
      name: string;
      nameAr: string;
      desc: string;
      descEn: string;
    }>;

    return {
      introTitle: t(`${pageKey}.introTitle`),
      introTitleEn: t(`${pageKey}.introTitleEn`),
      introDescription: t(`${pageKey}.introDescription`),
      introDescriptionEn: t(`${pageKey}.introDescriptionEn`),
      ctaTitle: t(`${pageKey}.ctaTitle`),
      ctaTitleEn: t(`${pageKey}.ctaTitleEn`),
      ctaDescription: t(`${pageKey}.ctaDescription`),
      ctaDescriptionEn: t(`${pageKey}.ctaDescriptionEn`),
      ctaButtonText: t(`${pageKey}.ctaButtonText`),
      ctaButtonTextEn: t(`${pageKey}.ctaButtonTextEn`),
      serviceTypes: defaults.map((item, index) => ({ ...item, order: index })),
    };
  }, [pageKey, t]);

  const localizedContent = resolvePageContent(content, language, pageDefaults);

  useEffect(() => {
    setImageKey(prev => prev + 1);
  }, [images]);

  useEffect(() => {
    const handleStorageChange = () => setImageKey(prev => prev + 1);
    window.addEventListener('customStorage', handleStorageChange);
    return () => window.removeEventListener('customStorage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/page-content/${pageKey}?lang=${language}`);
        if (res.ok) {
          const data = await res.json();
          dispatch(setPageContent(data as PageContentData));
        }
      } catch (_) { }
    };
    fetchContent();
  }, [dispatch, pageKey, language]);

  const heroImages = getImagesByPageAndSection(images, pageKey, 'hero');
  const galleryImages = getImagesByPageAndSection(images, pageKey, 'gallery');
  const projectImages = getImagesByPageAndSection(images, pageKey, 'projects');

  const defaultProjectsRaw = useMemo(() => {
    const items = t(`${pageKey}.defaultProjects`, { returnObjects: true, defaultValue: [] });
    return Array.isArray(items) ? items : [];
  }, [pageKey, t]);

  const imageProjects = projectImages.map((img, idx) => ({
    name: getProjectName(img.alt, idx, t),
    location: t('location'),
    image: img.url,
    id: img.id,
    videoUrl: img.videoUrl,
  }));

  const textProjects = defaultProjectsRaw.map(
    (item: { nameAr: string; name: string; clientAr?: string; client?: string }, idx: number) => ({
      name: language === 'ar' ? item.nameAr : item.name,
      location: language === 'ar' ? item.clientAr || t('location') : item.client || t('location'),
      image: null as string | null,
      id: `default-project-${idx}`,
      videoUrl: undefined as string | undefined,
    })
  );

  const projects = imageProjects.length > 0 ? imageProjects : textProjects;

  const richWorkAreas = useMemo(() => {
    const fromApi = content?.workAreaSections;
    if (fromApi?.length) return fromApi;
    return DEFAULT_WORK_AREAS[pageKey] || [];
  }, [pageKey, content?.workAreaSections]);

  const useRichWorkAreas = richWorkAreas.length > 0;

  const accentTextClass =
    accentColor === 'landscape' ? 'text-landscape-dark' : accentColor === 'metal' ? 'text-metal' : 'text-infra';

  const gallery = galleryImages.map((img) => img.url);
  const galleryKey = galleryImages.length > 0 ? galleryImages.map(img => img.id).join(',') : 'empty';
  const projectsKey = projectImages.length > 0 ? projectImages.map(img => img.id).join(',') : 'empty';
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const borderSide = isRtl ? 'border-r-4' : 'border-l-4';

  return (
    <div className="min-h-screen bg-gray-50 grain">
      <SeoHead
        title={t(`${pageKey}.seoTitle`)}
        description={t(`${pageKey}.seoDescription`)}
        path={`/${pageKey}`}
      />

      <PageHeader
        title={t(`${pageKey}.pageTitle`)}
        titleEn={t(`${pageKey}.pageTitleEn`)}
        accentColor={accentColor}
        images={heroImages}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="flex flex-wrap justify-center gap-2 mb-12 p-4 bg-white rounded-none shadow-md border border-gray-100">
          <a href="#work-areas" className="px-6 py-3 rounded-none bg-landscape/10 text-landscape-dark font-black hover:bg-landscape/20 transition-all uppercase tracking-wider text-xs">{t('nav.workAreas')}</a>
          <a href="#projects" className="px-6 py-3 rounded-none bg-landscape/10 text-landscape-dark font-black hover:bg-landscape/20 transition-all uppercase tracking-wider text-xs">{t('nav.projects')}</a>
          <a href="#gallery" className="px-6 py-3 rounded-none bg-landscape/10 text-landscape-dark font-black hover:bg-landscape/20 transition-all uppercase tracking-wider text-xs">{t('nav.gallery')}</a>
        </nav>

        {!useRichWorkAreas && (
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              {localizedContent.introTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed opacity-90">
              {localizedContent.introDescription}
            </p>
          </div>
        )}

        <div id="work-areas" className={`scroll-mt-24 ${useRichWorkAreas ? 'mb-16' : 'bg-white rounded-none shadow-xl p-8 md:p-12 mb-16 border border-gray-100 hover:shadow-2xl transition-all duration-500'}`}>
          {useRichWorkAreas ? (
            <WorkAreaSections
              sections={richWorkAreas}
              title={t(`${pageKey}.workAreasTitle`)}
              language={language}
              isRtl={isRtl}
              getSectionImages={(workAreaId) => getWorkAreaImages(images, pageKey, workAreaId)}
              accentClass={accentTextClass}
              accentTheme={accentColor}
              imageKey={imageKey}
            />
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-landscape to-landscape-dark rounded-full"></div>
                <h3 className={`text-xl md:text-2xl font-black text-gray-900 ${textAlign}`}>
                  {t(`${pageKey}.workAreasTitle`)}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {localizedContent.serviceTypes.map((type, index) => (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br from-green-50 to-gray-50 p-6 rounded-none ${borderSide} border-landscape hover:border-landscape-light hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex justify-between items-start mb-2 ${isRtl ? '' : 'flex-row-reverse'}`}>
                      <p className="text-xs text-gray-500 font-medium">{isRtl ? type.name : type.nameAr}</p>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-landscape-dark transition-colors duration-300">{isRtl ? type.nameAr : type.name}</h4>
                    </div>
                    <p className={`text-gray-600 ${textAlign} text-sm leading-relaxed whitespace-pre-line`}>{type.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div id="projects" className="scroll-mt-24 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-10 bg-gradient-to-b from-landscape to-landscape-dark rounded-full"></div>
            <h3 className={`text-xl md:text-2xl font-black text-gray-900 ${textAlign}`}>
              {t('sections.projects')}
            </h3>
          </div>
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6" key={`projects-${imageKey}-${projectsKey}`}>
              {projects.map((project, index) => (
                <div key={`${project.id || `project-${index}`}-${imageKey}`} className="bg-white rounded-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover-lift animate-fade-in-up border border-gray-100" style={{ animationDelay: `${index * 0.1}s` }}>
                  {project.image ? (
                  <div className="relative overflow-hidden bg-gray-900">
                    {projectImages[index]?.crop ? (
                      <div style={{ ...getImageWrapperStyle(projectImages[index]), height: '280px' }} />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full object-contain block mx-auto"
                        style={{ maxHeight: '300px', background: '#111827' }}
                        loading="lazy"
                        key={`${project.id || `project-img-${index}`}-${imageKey}`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

                    {project.videoUrl && (
                      <button
                        onClick={() => setActiveVideo(project.videoUrl!)}
                        className="absolute inset-0 flex items-center justify-center group/btn"
                      >
                        <div className="bg-cta text-white p-4 rounded-none shadow-2xl transform transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-cta-hover">
                          <Play className="h-8 w-8 fill-current" />
                        </div>
                      </button>
                    )}

                    <div className={`absolute bottom-0 right-0 left-0 p-5 text-white`}>
                      <h4 className={`text-lg font-bold mb-1 ${textAlign} group-hover:text-landscape-light transition-colors duration-300`}>{project.name}</h4>
                      <p className={`text-landscape-light ${textAlign} text-sm font-medium`}>{project.location}</p>
                    </div>
                  </div>
                  ) : (
                    <div className={`p-8 md:p-10 bg-gradient-to-br from-green-50 to-gray-50 ${borderSide} border-landscape`}>
                      <h4 className={`text-lg md:text-xl font-bold text-gray-900 mb-2 ${textAlign}`}>{project.name}</h4>
                      <p className={`text-landscape-dark ${textAlign} text-sm font-semibold`}>{project.location}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-lg">{t('sections.noProjects')}</p>
            </div>
          )}
        </div>

        <div id="gallery" className="scroll-mt-24 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-10 bg-gradient-to-b from-landscape to-landscape-dark rounded-full"></div>
            <h3 className={`text-xl md:text-2xl font-black text-gray-900 ${textAlign}`}>
              {t('sections.gallery')}
            </h3>
          </div>
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 items-stretch" key={`gallery-${imageKey}-${galleryKey}`}>
              {gallery.map((image, index) => (
                <div
                  key={`${galleryImages[index]?.id || `default-${index}`}-${imageKey}`}
                  className="flex flex-col overflow-hidden rounded-none bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative flex items-center justify-center flex-1 min-h-[320px] md:min-h-[360px] p-6 bg-gradient-to-br from-gray-50 to-white">
                    {galleryImages[index]?.crop ? (
                      <div style={getImageWrapperStyle(galleryImages[index])} className="w-full h-full" />
                    ) : (
                      <img
                        src={image}
                        alt={galleryImages[index]?.alt || t('galleryFallback', { number: index + 1 })}
                        className="w-full h-full object-contain rounded-none group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        key={`${galleryImages[index]?.id || `default-img-${index}`}-${imageKey}`}
                      />
                    )}
                  </div>
                  <div className="min-h-[80px] flex items-center p-4 md:p-5">
                    {(galleryImages[index]?.alt) ? (
                      <p className={`text-gray-700 text-base ${textAlign} leading-relaxed w-full`}>{galleryImages[index]?.alt}</p>
                    ) : (
                      <span className="invisible">.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-lg">{t('sections.noGallery')}</p>
            </div>
          )}
        </div>
      </section>

      <section className={`relative bg-gradient-to-b ${ctaGradient} text-white py-12 md:py-16 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{localizedContent.ctaTitle}</h3>
          <p className="text-white/90 mb-6 text-lg">{localizedContent.ctaDescription}</p>
          <Link
            to="/contact"
            className={`inline-block bg-white ${ctaTextColor} px-12 py-5 rounded-none font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none`}
          >
            {localizedContent.ctaButtonText}
          </Link>
        </div>
      </section>

      <VideoModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo || ''}
      />
    </div>
  );
}
