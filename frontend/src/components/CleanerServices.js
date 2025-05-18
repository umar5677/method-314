// src/components/CleanerServices.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const CleanerServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const id = user ? user.id : null;

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    axios.get(`${config.API_URL}/services/cleaner/${id}`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
      });
  }, [id, navigate]);

  const handleEditService = (serviceId) => {
    navigate(`/editservice/${serviceId}`);
  };

  const handleAddService = () => {
    navigate('/addservice');
  };

  const handleBackToMainMenu = () => {
    navigate('/home');
  };

  const handleDeleteService = (serviceId) => {
    const confirmation = window.confirm('Are you sure you want to delete this service?');
    if (confirmation) {
      axios.delete(`${config.API_URL}/services/${serviceId}`)
        .then(() => {
          setServices((prevServices) => prevServices.filter(service => service.serviceID !== serviceId));
          alert('Service deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting service:', error);
        });
    }
  };

  return (
    <div className="services-container">
      <div className="back-button-container">
        <button className="back-button" onClick={handleBackToMainMenu}>
          ← Back to Main Menu
        </button>
      </div>

      <div className="header">
        <h1>My Services</h1>
        <button className="add-service-button" onClick={handleAddService}>
          + Add Service
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Price</th>
              <th>Views</th>
              <th>Shortlist Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.serviceID}>
                <td>{service.category}</td>
                <td>${service.price}</td>
                <td>{service.view}</td>
                <td>{service.shortlistCount}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-button"
                      onClick={() => handleEditService(service.serviceID)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteService(service.serviceID)}
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
        .services-container {
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

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-service-button {
          padding: 8px 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-service-button:hover {
          background-color: #6366f1;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
          table-layout: fixed;
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
          justify-content: flex-start;
        }

        .action-button {
          padding: 10px 15px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-right: 10px;
        }

        .action-button:hover {
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

export default CleanerServices;
