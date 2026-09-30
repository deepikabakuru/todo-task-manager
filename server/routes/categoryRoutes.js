const express = require('express');
const {
  getUserCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createCategory);
router.get('/', getUserCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
