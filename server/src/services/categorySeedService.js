const Category = require('../models/Category');
const { getAllCategoryDefinitions, getCategorySlug, getCategoryName } = require('../config/categoryCatalog');

async function seedCategories() {
  const definitions = getAllCategoryDefinitions();
  let created = 0;

  for (let i = 0; i < definitions.length; i++) {
    const def = definitions[i];
    const exists = await Category.findOne({ slug: def.slug }).select('_id');

    await Category.findOneAndUpdate(
      { slug: def.slug },
      {
        name: def.name,
        slug: def.slug,
        description: def.description,
        order: i,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!exists) created++;
  }

  return { total: definitions.length, created, existing: definitions.length - created };
}

async function getOrCreateCategoryForPageSection(page, section) {
  const slug = getCategorySlug(page, section);
  let category = await Category.findOne({ slug });

  if (!category) {
    category = await Category.create({
      name: getCategoryName(page, section),
      slug,
      description: `Cloudinary: tam-gallery/${page}/${section}`,
      isActive: true,
    });
  }

  return category;
}

module.exports = {
  seedCategories,
  getOrCreateCategoryForPageSection,
};
