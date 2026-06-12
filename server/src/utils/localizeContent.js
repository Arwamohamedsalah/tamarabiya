/**
 * Localizes CMS page content for API responses.
 * Returns Arabic fields by default; swaps to English fields when lang=en.
 */
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
  };
}

module.exports = { localizePageContent };
