const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, createdAt: 1 });
  res.json(categories);
});

// POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, order, isActive } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'name and slug are required' });
  }

  const existing = await Category.findOne({ slug });
  if (existing) {
    return res.status(409).json({ message: 'Category with this slug already exists' });
  }

  const category = await Category.create({
    name,
    slug,
    description,
    order,
    isActive,
  });

  res.status(201).json(category);
});

// PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(category);
});

// DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(204).send();
});

