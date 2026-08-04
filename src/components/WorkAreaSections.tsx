import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CroppedImage from './CroppedImage';
import GalleryLightbox from './GalleryLightbox';
import type { ImageItem } from '../store/slices/imagesSlice';
import type { WorkAreaBlock, WorkAreaSection } from '../types/workAreaSection';
import type { SupportedLanguage } from '../i18n';

type AccentTheme = 'landscape' | 'metal' | 'infra';

interface WorkAreaSectionsProps {
  sections: WorkAreaSection[];
  title: string;
  language: SupportedLanguage;
  isRtl: boolean;
  getSectionImages: (workAreaId: string, sectionIndex: number) => ImageItem[];
  accentClass?: string;
  accentTheme?: AccentTheme;
  imageKey?: number;
}

const THEME_STYLES: Record<
  AccentTheme,
  { bar: string; badge: string; border: string; placeholder: string; dashed: string }
> = {
  landscape: {
    bar: 'bg-landscape',
    badge: 'bg-landscape/15 text-landscape-dark',
    border: 'border-landscape/30',
    placeholder: 'from-green-50 to-gray-100',
    dashed: 'border-landscape/30',
  },
  metal: {
    bar: 'bg-metal',
    badge: 'bg-metal/15 text-metal',
    border: 'border-metal/30',
    placeholder: 'from-gray-50 to-gray-100',
    dashed: 'border-metal/30',
  },
  infra: {
    bar: 'bg-infra',
    badge: 'bg-infra/15 text-infra',
    border: 'border-infra/30',
    placeholder: 'from-blue-50 to-gray-100',
    dashed: 'border-infra/30',
  },
};

function pickText(language: SupportedLanguage, ar: string, en: string) {
  return language === 'ar' ? ar : en;
}

function WorkAreaBlockView({
  block,
  language,
  textAlign,
  accentClass,
}: {
  block: WorkAreaBlock;
  language: SupportedLanguage;
  textAlign: string;
  accentClass: string;
}) {
  if (block.type === 'paragraph') {
    return (
      <p className={`text-gray-700 leading-relaxed text-base md:text-lg ${textAlign}`}>
        {pickText(language, block.text, block.textEn)}
      </p>
    );
  }

  if (block.type === 'heading') {
    return (
      <h4 className={`text-lg md:text-xl font-bold text-gray-900 ${textAlign}`}>
        {pickText(language, block.text, block.textEn)}
      </h4>
    );
  }

  if (block.type === 'highlight') {
    return (
      <div className={textAlign}>
        <p className={`font-bold text-base md:text-lg mb-2 ${accentClass}`}>
          <span className="me-1">*</span>
          {pickText(language, block.title, block.titleEn)}
        </p>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
          {pickText(language, block.body, block.bodyEn)}
        </p>
      </div>
    );
  }

  if (block.type === 'table') {
    const title = block.title || block.titleEn;
    return (
      <div className={textAlign}>
        {title && (
          <p className={`font-bold text-base md:text-lg mb-3 ${accentClass}`}>
            {pickText(language, block.title || '', block.titleEn || '')}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 font-bold text-gray-900">
                  {pickText(language, block.headerCol1, block.headerCol1En)}
                </th>
                <th className="border border-gray-300 px-4 py-2 font-bold text-gray-900">
                  {pickText(language, block.headerCol2, block.headerCol2En)}
                </th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {pickText(language, row.col1, row.col1En)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {pickText(language, row.col2, row.col2En)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const intro = block.intro || block.introEn;
  const items = language === 'ar' ? block.items : block.itemsEn;

  return (
    <div className={textAlign}>
      {intro && (
        <p className={`font-bold text-base md:text-lg mb-3 ${accentClass}`}>
          {pickText(language, block.intro || '', block.introEn || '')}
        </p>
      )}
      <ul className="space-y-2 list-disc list-inside marker:text-gray-800 text-gray-700 text-sm md:text-base leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function WorkAreaImageButton({
  image,
  imageKey,
  imgIndex,
  sectionTitle,
  onOpen,
}: {
  image: ImageItem;
  imageKey: number;
  imgIndex: number;
  sectionTitle: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="overflow-hidden rounded-none bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-500 group text-left w-full cursor-zoom-in border border-gray-200"
      aria-label={`${sectionTitle} - ${imgIndex + 1}`}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <CroppedImage
          key={`${image.id}-${imageKey}-${imgIndex}`}
          image={image}
          alt={image.alt || sectionTitle}
          className="absolute inset-0 w-full h-full"
          uncroppedClassName="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          fit="cover"
          loading="lazy"
        />
      </div>
    </button>
  );
}

const MAX_WORK_AREA_IMAGES = 8;

function getImageGridClass(imageCount: number, fullWidth = false): string {
  if (imageCount <= 1) {
    return fullWidth ? 'grid-cols-1 max-w-3xl mx-auto w-full' : 'grid-cols-1';
  }
  if (imageCount === 2) return 'grid-cols-2';
  if (imageCount === 3) return fullWidth ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3';
  if (imageCount === 4) return 'grid-cols-2';
  if (imageCount <= 6) return 'grid-cols-2 md:grid-cols-3';
  return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
}

export default function WorkAreaSections({
  sections,
  title,
  language,
  isRtl,
  getSectionImages,
  accentClass = 'text-landscape-dark',
  accentTheme = 'landscape',
  imageKey = 0,
}: WorkAreaSectionsProps) {
  const { t } = useTranslation('services');
  const theme = THEME_STYLES[accentTheme];
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const barSide = isRtl ? 'border-r-4' : 'border-l-4';
  const [lightbox, setLightbox] = useState<{ workAreaId: string; index: number } | null>(null);

  const lightboxImages = useMemo(() => {
    if (!lightbox) return [];
    return getSectionImages(lightbox.workAreaId, 0);
  }, [lightbox, getSectionImages]);

  const renderImage = (
    img: ImageItem,
    imgIndex: number,
    sectionId: string,
    sectionTitle: string
  ) => (
    <WorkAreaImageButton
      key={`${img.id}-${imageKey}-${imgIndex}`}
      image={img}
      imageKey={imageKey}
      imgIndex={imgIndex}
      sectionTitle={sectionTitle}
      onOpen={() => setLightbox({ workAreaId: sectionId, index: imgIndex })}
    />
  );

  return (
    <div className="mb-0">
      <div className={`flex items-center gap-3 mb-10 ${isRtl ? '' : 'flex-row-reverse justify-end'}`}>
        <div className={`w-1.5 h-12 ${theme.bar} rounded-none shrink-0`} />
        <h3 className={`text-2xl md:text-3xl font-black text-gray-900 ${textAlign}`}>{title}</h3>
      </div>

      <div className="space-y-14 md:space-y-20">
        {sections.map((section, sectionIndex) => {
          const slotCount = section.imageCount ?? 2;
          const allImages = getSectionImages(section.id, sectionIndex);
          const displayCount = allImages.length > 0 ? allImages.length : Math.min(slotCount, MAX_WORK_AREA_IMAGES);
          const sectionTitle = pickText(language, section.title, section.titleEn);
          const useFullWidthGallery = displayCount >= 3;

          const textColumn = (
            <div className={`space-y-5 ${barSide} ${theme.border} ${isRtl ? 'pr-5 md:pr-6' : 'pl-5 md:pl-6'}`}>
              <h4 className={`text-xl md:text-2xl font-black text-gray-900 ${textAlign}`}>
                {sectionTitle}
              </h4>
              {section.blocks.map((block, blockIndex) => (
                <WorkAreaBlockView
                  key={`${section.id}-block-${blockIndex}`}
                  block={block}
                  language={language}
                  textAlign={textAlign}
                  accentClass={accentClass}
                />
              ))}
            </div>
          );

          const imagesGrid = (
            <div
              className={`grid ${getImageGridClass(displayCount, useFullWidthGallery)} ${
                useFullWidthGallery ? 'gap-4 md:gap-6' : 'gap-4 md:gap-5'
              } w-full`}
            >
              {allImages.length > 0 ? (
                allImages.map((img, imgIndex) =>
                  renderImage(img, imgIndex, section.id, sectionTitle)
                )
              ) : (
                Array.from({ length: Math.min(slotCount, MAX_WORK_AREA_IMAGES) }).map((_, placeholderIndex) => (
                  <div
                    key={placeholderIndex}
                    className={`aspect-[4/3] bg-gradient-to-br ${theme.placeholder} border border-dashed ${theme.dashed} flex items-center justify-center p-4`}
                  >
                    <p className="text-gray-400 text-xs md:text-sm text-center">{sectionTitle}</p>
                  </div>
                ))
              )}
            </div>
          );

          return (
            <article
              key={section.id}
              className={
                useFullWidthGallery
                  ? 'flex flex-col gap-8 md:gap-10 bg-white p-6 md:p-10 border border-gray-100 shadow-sm'
                  : 'grid lg:grid-cols-[2fr_3fr] gap-8 lg:gap-10 items-start bg-white p-6 md:p-10 border border-gray-100 shadow-sm'
              }
            >
              {textColumn}
              {imagesGrid}
            </article>
          );
        })}
      </div>

      <GalleryLightbox
        images={lightboxImages}
        initialIndex={lightbox?.index ?? 0}
        isOpen={lightbox !== null && lightboxImages.length > 0}
        onClose={() => setLightbox(null)}
        getAlt={(img, idx) => img.alt || t('galleryFallback', { number: idx + 1 })}
      />
    </div>
  );
}
