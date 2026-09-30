const Category = require('../models/Category');

const getUserCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find({ user: req.user })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments({ user: req.user }),
    ]);

    return res.status(200).json({
      categories,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to fetch categories' });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const category = await Category.create({
      name,
      user: req.user,
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to create category' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(404).json({ message: 'Category not found' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.body.name !== undefined) {
      category.name = req.body.name;
    }

    const updatedCategory = await category.save();
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to delete category' });
  }
};

module.exports = {
  getUserCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
