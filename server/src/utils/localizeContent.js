/**
 * Localizes CMS page content for API responses.
 * Returns Arabic fields by default; swaps to English fields when lang=en.
 */
function localizeWorkAreaBlock(block) {
  if (!block) return block;

  if (block.type === 'paragraph' || block.type === 'heading') {
    return {
      ...block,
      text: block.textEn || block.text,
      textEn: block.textEn || block.text,
    };
  }

  if (block.type === 'highlight') {
    return {
      ...block,
      title: block.titleEn || block.title,
      titleEn: block.titleEn || block.title,
      body: block.bodyEn || block.body,
      bodyEn: block.bodyEn || block.body,
    };
  }

  if (block.type === 'list') {
    return {
      ...block,
      intro: block.introEn || block.intro,
      introEn: block.introEn || block.intro,
      items: block.itemsEn?.length ? block.itemsEn : block.items,
      itemsEn: block.itemsEn || block.items,
    };
  }

  if (block.type === 'table') {
    return {
      ...block,
      title: block.titleEn || block.title,
      titleEn: block.titleEn || block.title,
      headerCol1: block.headerCol1En || block.headerCol1,
      headerCol1En: block.headerCol1En || block.headerCol1,
      headerCol2: block.headerCol2En || block.headerCol2,
      headerCol2En: block.headerCol2En || block.headerCol2,
      rows: (block.rows || []).map((row) => ({
        ...row,
        col1: row.col1En || row.col1,
        col1En: row.col1En || row.col1,
        col2: row.col2En || row.col2,
        col2En: row.col2En || row.col2,
      })),
    };
  }

  return block;
}

function localizePageContent(doc, lang = 'ar') {
  const source = doc?.toObject ? doc.toObject() : { ...doc };

  if (lang !== 'en') {
    return source;
  }

  return {
    ...source,
    introTitle: source.introTitleEn || source.introTitle,
    introDescription: source.introDescriptionEn || source.introDescription,
    ctaTitle: source.ctaTitleEn || source.ctaTitle,
    ctaDescription: source.ctaDescriptionEn || source.ctaDescription,
    ctaButtonText: source.ctaButtonTextEn || source.ctaButtonText,
    serviceTypes: (source.serviceTypes || []).map((type) => ({
      ...type,
      name: type.name || type.nameAr,
      nameAr: type.nameAr || type.name,
      desc: type.descEn || type.desc,
    })),
    workAreaSections: (source.workAreaSections || []).map((section) => ({
      ...section,
      title: section.titleEn || section.title,
      titleEn: section.titleEn || section.title,
      blocks: (section.blocks || []).map(localizeWorkAreaBlock),
    })),
  };
}

module.exports = { localizePageContent };
