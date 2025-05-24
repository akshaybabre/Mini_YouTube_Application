import express from 'express';
import Category from '../models/Category.js';
import authenticateAdmin from '../middlewares/authenticateAdmin.js';

const router = express.Router();

// ➕ Create category
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;
    
    const numericCategoryId = Number(categoryId);
    if (isNaN(numericCategoryId)) {
      return res.status(400).json({ message: 'categoryId must be a number' });
    }

    const existingCategory = await Category.findOne({ categoryId: numericCategoryId });
    if (existingCategory) {
      return res.status(400).json({ message: 'categoryId already exists' });
    }

    const category = new Category({ categoryId: numericCategoryId, categoryName });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
});

//  Get all categories
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

//  Update category
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { categoryId: Number(req.params.id) },
      { categoryId: Number(req.body.categoryId), categoryName: req.body.categoryName },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category' });
  }
});

//  Delete category
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ categoryId: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

export default router;