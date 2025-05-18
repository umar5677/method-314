import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const AddService = () => {
  const navigate = useNavigate();
  const [service, setService] = useState({
    category: '',
    price: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    axios.get(`${config.API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);  // Set the fetched categories
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get user data from the cookie
    const userData = Cookies.get('user');
    if (!userData) {
      console.error('User data not found in cookies');
      return;
    }

    const user = JSON.parse(userData);
    const cleanerId = user.id;  // Get the user ID from the cookie data

    const serviceData = {
      "category": service.category,
      "cleanerID": cleanerId,
      "price": service.price
    };

    // Send new service details
    axios.post(`${config.API_URL}/services`, serviceData)
      .then(() => {
        alert('Service added successfully');
        navigate('/cleanerservices');
      })
      .catch((error) => {
        console.error('Error adding service:', error);
      });
  };

  return (
    <div className="add-service-container">
      <h1>Add Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={service.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={service.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Add Service</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/cleanerservices')}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        .add-service-container {
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

        .form-group {
          margin-bottom: 1.2rem;
        }

        label {
          display: block;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        input, select {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        .form-actions {
          text-align: center;
          margin-top: 1.5rem;
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

export default AddService;
