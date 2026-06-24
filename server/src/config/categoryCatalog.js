/**
 * Dashboard page/section combinations → MongoDB Category slugs + Cloudinary folders.
 * Cloudinary path: tam-gallery/{page}/{section}
 * Category slug:    {page}-{section}
 */

const PAGE_LABELS = {
  home: 'الصفحة الرئيسية',
  about: 'عن الشركة',
  contact: 'تواصل معنا',
  landscaping: 'اللاندسكيب',
  fencing: 'السياجات',
  infrastructure: 'البنية التحتية',
};

const SECTION_LABELS = {
  hero: 'الصورة الرئيسية',
  services: 'الخدمات',
  header: 'الهيدر',
  gallery: 'معرض الصور',
  projects: 'المشاريع',
  content: 'محتوى الصفحة',
  'work-area': 'صور مجالات العمل',
};

/** Sections available per page (matches Dashboard sidebar) */
const PAGE_SECTIONS = {
  home: ['hero', 'services', 'header'],
  about: ['hero'],
  contact: ['hero'],
  landscaping: ['hero', 'gallery', 'projects', 'content', 'work-area'],
  fencing: ['hero', 'gallery', 'projects', 'content', 'work-area'],
  infrastructure: ['hero', 'gallery', 'projects', 'content', 'work-area'],
};

function getCategorySlug(page, section) {
  return `${page}-${section}`;
}

function getCategoryName(page, section) {
  const pageLabel = PAGE_LABELS[page] || page;
  const sectionLabel = SECTION_LABELS[section] || section;
  return `${pageLabel} - ${sectionLabel}`;
}

function getAllCategoryDefinitions() {
  const definitions = [];

  for (const [page, sections] of Object.entries(PAGE_SECTIONS)) {
    for (const section of sections) {
      definitions.push({
        page,
        section,
        slug: getCategorySlug(page, section),
        name: getCategoryName(page, section),
        description: `Cloudinary: tam-gallery/${page}/${section}`,
      });
    }
  }

  return definitions;
}

module.exports = {
  PAGE_LABELS,
  SECTION_LABELS,
  PAGE_SECTIONS,
  getCategorySlug,
  getCategoryName,
  getAllCategoryDefinitions,
};
