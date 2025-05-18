import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const EditCategory = () => {
  const { categoryID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryData, setCategoryData] = useState({ category: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stateData = location.state;
  
    // Check if there is state data passed via navigation
    if (stateData) {
      setCategoryData({
        category: stateData.category,
      });
    } else {
      // If no state data, leave categoryData blank (initial state is already empty)
      setCategoryData({});
    }
  
    setLoading(false);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios.put(`${config.API_URL}/categories/${categoryID}`, categoryData)
      .then(() => {
        alert('Category updated successfully!'); // Add this line
        navigate('/allcategories');
      })
      .catch((error) => {
        console.error('Failed to update category:', error);
        alert('Failed to update category. Please try again.'); // Optional error alert
      });
  };

  const handleBack = () => {
    navigate('/allcategories');
  };

  if (loading) return <p>Loading category data...</p>;

  return (
    <div className="edit-category-container">
      <h1>Edit Category</h1>

      <div className="form-group">
        <label>Category Name:</label>
        <input
          type="text"
          name="category"
          value={categoryData.category}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
        <button className="cancel-button" onClick={handleBack}>
          Cancel
        </button>
      </div>

      <style>{`
        .edit-category-container {
          padding: 2rem;
          font-family: sans-serif;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        h1 {
          color: #4f46e5;
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          max-width: 400px;
          margin: auto;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 1rem;
        }

        .form-actions {
          text-align: center;
          margin-top: 2rem;
        }

        .save-button {
          padding: 10px 20px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .save-button:hover {
          background-color: #6366f1;
        }

        .cancel-button {
          margin-left: 10px;
          padding: 10px 20px;
          background-color: #e5e7eb;
          color: #333;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .cancel-button:hover {
          background-color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default EditCategory;
