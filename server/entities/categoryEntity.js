const db = require('../db');

class CategoryEntity {
  // Get all categories
  getAllCategories() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM categories', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Add a category
  addCategory(category) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO categories (category) VALUES (?)';
      db.query(query, [category], (err, results) => {
        if (err) return reject(err);
        resolve({ category });
      });
    });
  }

  // Update a category by ID
  updateCategoryByID(categoryID, updatedData) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE categories SET category = ? WHERE categoryID = ?';
      db.query(query, [updatedData.category, categoryID], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) return reject('Category not found');
        resolve({ categoryID, category: updatedData.category });
      });
    });
  }

  // Delete a category by ID
  deleteCategoryByID(categoryID) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM categories WHERE categoryID = ?';
      db.query(query, [categoryID], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) return reject('Category not found');
        resolve({ message: `Category ID ${categoryID} deleted successfully` });
      });
    });
  }
}

module.exports = new CategoryEntity();
