import { getImageWrapperStyle } from '../utils/imageUtils';
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
  legacyGalleryImages?: ImageItem[];
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

export default function WorkAreaSections({
  sections,
  title,
  language,
  isRtl,
  getSectionImages,
  legacyGalleryImages = [],
  accentClass = 'text-landscape-dark',
  accentTheme = 'landscape',
  imageKey = 0,
}: WorkAreaSectionsProps) {
  const theme = THEME_STYLES[accentTheme];
  const textAlign = isRtl ? 'text-right' : 'text-left';
  const barSide = isRtl ? 'border-r-4' : 'border-l-4';

  return (
    <div className="mb-0">
      <div className={`flex items-center gap-3 mb-10 ${isRtl ? '' : 'flex-row-reverse justify-end'}`}>
        <div className={`w-1.5 h-12 ${theme.bar} rounded-none shrink-0`} />
        <h3 className={`text-2xl md:text-3xl font-black text-gray-900 ${textAlign}`}>{title}</h3>
      </div>

      <div className="space-y-14 md:space-y-20">
        {sections.map((section, sectionIndex) => {
          const slotCount = section.imageCount ?? 2;
          const dedicatedImages = getSectionImages(section.id, sectionIndex);
          const legacyStart = sections
            .slice(0, sectionIndex)
            .reduce((sum, s) => sum + (s.imageCount ?? 2), 0);
          const sectionImages =
            dedicatedImages.length > 0
              ? dedicatedImages.slice(0, slotCount)
              : legacyGalleryImages.slice(legacyStart, legacyStart + slotCount);
          const sectionTitle = pickText(language, section.title, section.titleEn);

          const textColumn = (
            <div className={`space-y-5 ${barSide} ${theme.border} ${isRtl ? 'pr-5 md:pr-6' : 'pl-5 md:pl-6'}`}>
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

          const imagesColumn = (
            <div className="space-y-4">
              <div className={`inline-block ${theme.badge} px-5 py-2.5 font-bold text-base md:text-lg`}>
                {sectionTitle}
              </div>
              <div className="space-y-4">
                {sectionImages.length > 0 ? (
                  sectionImages.map((img, imgIndex) => (
                    <div
                      key={`${img.id}-${imageKey}-${imgIndex}`}
                      className="overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                    >
                      {img.crop ? (
                        <div style={{ ...getImageWrapperStyle(img), minHeight: '220px' }} />
                      ) : (
                        <img
                          src={img.url}
                          alt={img.alt || sectionTitle}
                          className="w-full h-auto max-h-[320px] object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  Array.from({ length: slotCount }).map((_, placeholderIndex) => (
                    <div
                      key={placeholderIndex}
                      className={`min-h-[200px] md:min-h-[240px] bg-gradient-to-br ${theme.placeholder} border border-dashed ${theme.dashed} flex items-center justify-center p-6`}
                    >
                      <p className="text-gray-400 text-sm text-center">{sectionTitle}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );

          return (
            <article
              key={section.id}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start bg-white p-6 md:p-10 border border-gray-100 shadow-sm"
            >
              {isRtl ? (
                <>
                  {textColumn}
                  {imagesColumn}
                </>
              ) : (
                <>
                  {imagesColumn}
                  {textColumn}
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
