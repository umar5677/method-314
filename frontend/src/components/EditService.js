// src/components/EditService.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const EditService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({
    category: '',
    price: ''
  });

  useEffect(() => {
    axios.get(`${config.API_URL}/services/${serviceId}`)
      .then((response) => {
        setService(response.data);
      })
      .catch((error) => {
        console.error('Error fetching service:', error);
      });
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate the price input to accept only valid integers or decimals
    if (name === 'price') {
      const regex = /^[0-9]*\.?[0-9]*$/; // This regex allows digits with an optional decimal point
      if (regex.test(value)) {
        setService((prev) => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setService((prev) => ({
        ...prev,
        [name]: value
      }));
    }
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
    const testnum = 67.97;
    // Prepare data to send
    const serviceData = {
      "category": service.category,
      "cleanerID": cleanerId,
      "price": service.price
    };

    // Send updated service details
    axios.put(`${config.API_URL}/services/${serviceId}`, serviceData)
      .then(() => {
        alert('Service updated successfully');
        navigate('/cleanerservices');
      })
      .catch((error) => {
        console.error('Error updating service:', error);
      });
  };

  return (
    <div className="edit-service-container">
      <h1>Edit Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={service.category}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            id="price"
            name="price"
            value={service.price}
            onChange={handleChange}
            required
            pattern="^\d+(\.\d{1,2})?$"  // Regex to allow numbers with or without decimal point (optional 2 decimals)
            title="Price should be a valid number, with optional decimal points."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Save Changes</button>
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
        .edit-service-container {
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

        input {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        input:disabled {
          background-color: #f3f4f6;
          color: #6b7280;
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

export default EditService;
