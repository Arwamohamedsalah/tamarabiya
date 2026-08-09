import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setPageContent } from '../store/slices/pageContentSlice';
import SeoHead from '../components/SeoHead';
import PageHeader from '../components/PageHeader';
import GalleryLightbox from '../components/GalleryLightbox';
import {
  getImagesByPageAndSection,
  getWorkAreaImages,
  getProjectImages,
  getLegacyProjectImages,
} from '../utils/imageUtils';
import CroppedImage from './CroppedImage';
import { resolvePageContent, getProjectName, resolveProjectDisplay } from '../utils/localizedContent';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import WorkAreaSections from './WorkAreaSections';
import landscapingWorkAreas from '../content/landscapingWorkAreas.json';
import fencingWorkAreas from '../content/fencingWorkAreas.json';
import infrastructureWorkAreas from '../content/infrastructureWorkAreas.json';
import type { WorkAreaSection } from '../types/workAreaSection';
import type { PageContentData } from '../store/slices/pageContentSlice';
import type { ImageItem } from '../store/slices/imagesSlice';
import { normalizeWorkAreaSections } from '../utils/workAreaSections';

import { API_BASE_URL } from '../config/api';

type ServicePageKey = 'landscaping' | 'fencing' | 'infrastructure';

interface DisplayProject {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  images: ImageItem[];
}

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
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [activeProjectLightbox, setActiveProjectLightbox] = useState<{ projectId: string; index: number } | null>(null);

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

  const displayProjects = useMemo((): DisplayProject[] => {
    const structured = content?.projects?.length
      ? [...content.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : [];

    if (structured.length) {
      return structured
        .map((project) => {
          const display = resolveProjectDisplay(project, language);
          return {
            id: project.id,
            name: display.name,
            subtitle: display.subtitle,
            description: display.description,
            images: getProjectImages(images, pageKey, project.id),
          };
        })
        .filter((project) => project.name || project.images.length > 0);
    }

    const legacyImages = getLegacyProjectImages(images, pageKey);
    if (legacyImages.length) {
      return legacyImages.map((img, idx) => ({
        id: img.id,
        name: getProjectName(img.alt, idx, t),
        subtitle: t('location'),
        description: '',
        images: [img],
      }));
    }

    return [];
  }, [content?.projects, images, pageKey, language, t]);

  const projectLightboxImages = useMemo(() => {
    if (!activeProjectLightbox) return [];
    return displayProjects.find((project) => project.id === activeProjectLightbox.projectId)?.images ?? [];
  }, [activeProjectLightbox, displayProjects]);

  const richWorkAreas = useMemo(() => {
    const fromApi = content?.workAreaSections;
    const sections = fromApi?.length ? fromApi : DEFAULT_WORK_AREAS[pageKey] || [];
    return pageKey === 'infrastructure' ? normalizeWorkAreaSections(sections) : sections;
  }, [pageKey, content?.workAreaSections]);

  const useRichWorkAreas = richWorkAreas.length > 0;

  const accentTextClass =
    accentColor === 'landscape' ? 'text-landscape-dark' : accentColor === 'metal' ? 'text-metal' : 'text-infra';
  const accentBorderClass =
    accentColor === 'landscape' ? 'border-landscape' : accentColor === 'metal' ? 'border-metal' : 'border-infra';

  const gallery = galleryImages.map((img) => img.url);
  const galleryKey = galleryImages.length > 0 ? galleryImages.map(img => img.id).join(',') : 'empty';
  const projectsKey = displayProjects.map((project) => project.id).join(',') || 'empty';
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
          {displayProjects.length > 0 ? (
            <div className="space-y-8" key={`projects-${imageKey}-${projectsKey}`}>
              {displayProjects.map((project, index) => (
                <article
                  key={`${project.id}-${imageKey}`}
                  className={`bg-white rounded-none shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in-up ${borderSide} ${accentBorderClass}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className={`px-6 md:px-10 py-6 md:py-8 ${textAlign}`}>
                    <h4 className={`text-xl md:text-2xl font-black text-gray-900 mb-2 leading-tight ${accentTextClass}`}>
                      {project.name}
                    </h4>
                    {project.subtitle && project.subtitle !== project.name && (
                      <p className="text-xs text-gray-500 font-medium mb-3">{project.subtitle}</p>
                    )}
                    {project.description && (
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {project.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-6 md:px-10 pb-6 md:pb-8">
                      {project.images.map((img, imgIndex) => (
                        <button
                          key={`${img.id}-${imageKey}`}
                          type="button"
                          onClick={() => setActiveProjectLightbox({ projectId: project.id, index: imgIndex })}
                          className="overflow-hidden rounded-none bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-500 group text-left w-full cursor-zoom-in"
                          aria-label={`${project.name} - ${imgIndex + 1}`}
                        >
                          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                            <CroppedImage
                              image={img}
                              alt={img.alt || project.name}
                              className="absolute inset-0 w-full h-full"
                              uncroppedClassName="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              fit="cover"
                              loading="lazy"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </article>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8" key={`gallery-${imageKey}-${galleryKey}`}>
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${galleryImages[index]?.id || `default-${index}`}-${imageKey}`}
                  onClick={() => setActiveGalleryIndex(index)}
                  className="overflow-hidden rounded-none bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-500 group text-left w-full cursor-zoom-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  aria-label={galleryImages[index]?.alt || t('galleryFallback', { number: index + 1 })}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    {galleryImages[index] ? (
                      <CroppedImage
                        key={`${galleryImages[index]?.id || `default-img-${index}`}-${imageKey}`}
                        image={galleryImages[index]}
                        alt={galleryImages[index]?.alt || t('galleryFallback', { number: index + 1 })}
                        className="absolute inset-0 w-full h-full"
                        uncroppedClassName="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        fit="contain"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={image}
                        alt={t('galleryFallback', { number: index + 1 })}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                  </div>
                </button>
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

      <GalleryLightbox
        images={galleryImages}
        initialIndex={activeGalleryIndex ?? 0}
        isOpen={activeGalleryIndex !== null}
        onClose={() => setActiveGalleryIndex(null)}
        getAlt={(img, idx) => img.alt || t('galleryFallback', { number: idx + 1 })}
      />

      <GalleryLightbox
        images={projectLightboxImages}
        initialIndex={activeProjectLightbox?.index ?? 0}
        isOpen={activeProjectLightbox !== null && projectLightboxImages.length > 0}
        onClose={() => setActiveProjectLightbox(null)}
        getAlt={(img, idx) => img.alt || t('galleryFallback', { number: idx + 1 })}
      />
    </div>
  );
}
