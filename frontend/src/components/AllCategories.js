// src/components/AllCategories.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${config.API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleBackToMainMenu = () => {
    navigate('/home');
  };

  const handleEditCategory = (categoryID, category) => {
    navigate(`/editcategory/${categoryID}`, {
      state: { category } // Pass both categoryID and category to the edit page
    });
  };

  const handleDeleteCategory = (categoryID) => {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      axios.delete(`${config.API_URL}/categories/${categoryID}`)
        .then(() => {
          setCategories((prev) => prev.filter(cat => cat.categoryID !== categoryID));
          alert('Category deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
        });
    }
  };

  const handleAddCategory = () => {
    navigate('/addcategory');
  };

  return (
    <div className="categories-container">
      <div className="header-container">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBackToMainMenu}>
            ← Back to Main Menu
          </button>
        </div>
        <button className="add-category-button" onClick={handleAddCategory}>
          + Add Category
        </button>
      </div>

      <div className="header">
        <h1>All Categories</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.categoryID}>
                <td>{cat.category}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditCategory(cat.categoryID, cat.category)} // Pass both categoryID and category
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCategory(cat.categoryID)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .categories-container {
          padding: 2rem;
          background-color: #f9fafb;
          font-family: sans-serif;
          min-height: 100vh;
        }

        h1 {
          color: #4f46e5;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-category-button {
          padding: 8px 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-category-button:hover {
          background-color: #6366f1;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
        }

        th, td {
          padding: 15px;
          text-align: center;
          border: 1px solid #ddd;
        }

        th {
          background-color: #4f46e5;
          color: white;
        }

        td {
          background-color: #fff;
        }

        .back-button-container {
          margin-bottom: 20px;
          text-align: left;
        }

        .back-button {
          padding: 12px;
          background-color: #7c3aed;
          color: white;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          border-radius: 8px;
        }

        .back-button:hover {
          background-color: #6d28d9;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
        }

        .edit-button {
          padding: 10px 15px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-right: 10px;
        }

        .edit-button:hover {
          background-color: #3b36c9;
        }

        .delete-button {
          padding: 10px 15px;
          background-color: #e11d48;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .delete-button:hover {
          background-color: #9b1d38;
        }
      `}</style>
    </div>
  );
};

export default AllCategories;
