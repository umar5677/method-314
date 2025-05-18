import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const AllServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const id = user ? user.id : null;

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [servicesRes, usersRes] = await Promise.all([
          axios.get(`${config.API_URL}/services`),
          axios.get(`${config.API_URL}/users`)
        ]);
        setServices(servicesRes.data);
        console.log(servicesRes.data)
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleViewDetails = async (serviceId) => {
    try {
      await axios.post(`${config.API_URL}/views`, {
        serviceID: serviceId,
        accountID: id,
      });
      navigate(`/viewservice/${serviceId}`);
    } catch (error) {
      console.error('Failed to record view:', error);
      navigate(`/viewservice/${serviceId}`); // Still navigate even if logging the view fails
    }
  };

  const handleBackToMainMenu = () => {
    navigate('/home');
  };

  const getCleanerName = (cleanerId) => {
    console.log('Users:', users);
    console.log('Cleaner ID:', cleanerId);
    const cleaner = users.find(user => user.id === cleanerId);
    return cleaner?.username || 'Unknown Cleaner';
  };

  return (
    <div className="services-container">
      <div className="back-button-container">
        <button className="back-button" onClick={handleBackToMainMenu}>
          ← Back to Main Menu
        </button>
      </div>

      <div className="header">
        <h1>All Services</h1>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Price</th>
                <th>Cleaner Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.serviceID}>
                  <td>{service.category}</td>
                  <td>${service.price}</td>
                  <td>{getCleanerName(service.cleanerID)}</td>
                  <td>
                    <button 
                      className="view-button"
                      onClick={() => handleViewDetails(service.serviceID)}
                    >
                      🔍 View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
          margin-bottom: 2rem;
        }

        .add-service-button {
          padding: 8px 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
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

        .view-button {
          padding: 10px 15px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .view-button:hover {
          background-color: #3b36c9;
        }
      `}</style>
    </div>
  );
};

export default AllServices;
