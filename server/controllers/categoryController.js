const express = require('express');
const router = express.Router();
const categoryEntity = require('../entities/categoryEntity');

// === Controllers ===
class GetCategoryController {
  static async getAll(req, res) {
    try {
      const categories = await categoryEntity.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories', details: error });
    }
  }
}

class CreateCategoryController {
  static async create(req, res) {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    try {
      const newCategory = await categoryEntity.addCategory(category);
      res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add category', details: error });
    }
  }
}

class UpdateCategoryController {
  static async update(req, res) {
    const { categoryID } = req.params;
    const updatedData = req.body;

    try {
      const updatedCategory = await categoryEntity.updateCategoryByID(categoryID, updatedData);
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      res.status(404).json({ error: 'Category not found or failed to update', details: error });
    }
  }
}

class DeleteCategoryController {
  static async delete(req, res) {
    const { categoryID } = req.params;
    try {
      const result = await categoryEntity.deleteCategoryByID(categoryID);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: 'Category not found', details: error });
    }
  }
}

// === Routes ===
router.get('/categories', GetCategoryController.getAll);
router.post('/categories', CreateCategoryController.create);
router.put('/categories/:categoryID', UpdateCategoryController.update);
router.delete('/categories/:categoryID', DeleteCategoryController.delete);

module.exports = router;
