import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const ViewService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [cleanerName, setCleanerName] = useState('Loading...');
  const [shortlistList, setShortlistList] = useState([]);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch service data
        const serviceResponse = await axios.get(`${config.API_URL}/services/${id}`);
        setService(serviceResponse.data);

        // Fetch cleaner data
        if (serviceResponse.data.cleanerID) {
          try {
            const cleanerResponse = await axios.get(`${config.API_URL}/users/${serviceResponse.data.cleanerID}`);
            setCleanerName(cleanerResponse.data.username);
          } catch (cleanerError) {
            console.error('Error fetching cleaner:', cleanerError);
            setCleanerName('Unknown Cleaner');
          }
        }

        // Fetch shortlist
        try {
          const shortlistResponse = await axios.get(`${config.API_URL}/services/howner/${userId}`);
          setShortlistList(shortlistResponse.data || []);
          setIsShortlisted(shortlistResponse.data.some(
            service => service.serviceID === parseInt(id)
          ));
        } catch (shortlistError) {
          console.error('Error fetching shortlist:', shortlistError);
          setShortlistList([]);
        }
      } catch (err) {
        setError('Failed to load service details');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId, navigate]);

  const handleBack = () => {
    navigate('/allservices');
  };

  const handleShortlistToggle = async () => {
    const serviceID = parseInt(id);
    const hownerID = userId;

    try {
      const payload = {
        serviceID: parseInt(id),
        hownerID: userId
      };
  
      if (isShortlisted) {
        console.log('Removing:', payload);
        // DELETE requires data property
        await axios.delete(`${config.API_URL}/shortlists`, { data: payload });
      } else {
        console.log('Adding:', payload);
        // POST sends payload directly
        await axios.post(`${config.API_URL}/shortlists`, payload);
      }
      setIsShortlisted(!isShortlisted);
    } catch (err) {
      console.error('Shortlist update failed:', err);
      alert('Failed to update shortlist status');
    }
  };

  if (loading) return <p>Loading service details...</p>;
  if (error) return <p>{error}</p>;
  if (!service) return <p>Service not found</p>;

  return (
    <div className="service-details-container">
      <button className="back-button" onClick={handleBack}>
        ← Back to Services
      </button>

      <h1>Service Details</h1>
      
      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">Service ID:</span>
          <span>{service.serviceID}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Category:</span>
          <span>{service.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Cleaner:</span>
          <span>{cleanerName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Price:</span>
          <span>${service.price}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Shortlist Status:</span>
          <span>{isShortlisted ? '★ Shortlisted' : '☆ Not Shortlisted'}</span>
        </div>

        <div className="button-row">
          <button
            className={`shortlist-button ${isShortlisted ? 'remove' : 'add'}`}
            onClick={handleShortlistToggle}
          >
            {isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          </button>
        </div>
      </div>

      <style>{`
        .service-details-container {
          padding: 2rem;
          font-family: sans-serif;
          background-color: #f9fafb;
          min-height: 100vh;
        }
        
        .back-button {
          padding: 10px 15px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        .button-row {
          margin-top: 1.5rem;
          text-align: center;
        }

        .shortlist-button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .shortlist-button.add {
          background-color: #10b981;
          color: white;
        }

        .shortlist-button.remove {
          background-color: #ef4444;
          color: white;
        }

        h1 {
          color: #4f46e5;
          margin-bottom: 2rem;
          text-align: center;
        }

        .details-card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 600;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default ViewService;
