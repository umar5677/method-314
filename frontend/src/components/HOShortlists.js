import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const HOShortlists = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const hownerId = user?.id;

  useEffect(() => {
    if (!hownerId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [shortlistsRes, usersRes] = await Promise.all([
          axios.get(`${config.API_URL}/services/howner/${hownerId}`),
          axios.get(`${config.API_URL}/users`)
        ]);
        
        setServices(shortlistsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hownerId, navigate]);

  const handleRemoveShortlist = async (serviceID) => {
    const confirmed = window.confirm('Are you sure you want to remove this service from your shortlist?');
    if (!confirmed) return;

    try {
      const payload = {
        serviceID: parseInt(serviceID),
        hownerID: hownerId
      };

      await axios.delete(`${config.API_URL}/shortlists`, { data: payload });
      setServices(services.filter(service => service.serviceID !== serviceID));
    } catch (error) {
      console.error('Error removing shortlist:', error);
      alert('Failed to remove from shortlist');
    }
  };

  const handleBackToMainMenu = () => {
    navigate('/home');
  };

  const getCleanerName = (cleanerId) => {
    const cleaner = users.find(user => user.id === cleanerId);
    return cleaner?.username || 'Unknown Cleaner';
  };

  return (
    <div className="shortlists-container">
      <div className="back-button-container">
        <button className="back-button" onClick={handleBackToMainMenu}>
          ← Back to Main Menu
        </button>
      </div>

      <div className="header">
        <h1>My Shortlisted Services</h1>
      </div>

      {loading ? (
        <p>Loading shortlists...</p>
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
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.serviceID}>
                    <td>{service.category}</td>
                    <td>${service.price}</td>
                    <td>{getCleanerName(service.cleanerID)}</td>
                    <td>
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveShortlist(service.serviceID)}
                      >
                        ❌ Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No services shortlisted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .shortlists-container {
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

        .remove-button {
          padding: 10px 15px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .remove-button:hover {
          background-color: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default HOShortlists;
