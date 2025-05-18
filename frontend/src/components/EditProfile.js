// src/components/EditProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const EditProfile = () => {
  const { profileID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState({ profile: '', suspended: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stateData = location.state;

    if (stateData) {
      setProfileData({
        profile: stateData.profile,
        suspended: stateData.suspended
      });
      setLoading(false);
    } else {
      axios.get(`${config.API_URL}/profiles/${profileID}`)
        .then((response) => {
          setProfileData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch profile data:', error);
          setLoading(false);
        });
    }
  }, [profileID, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === 'suspended' ? parseInt(value) : value,
    }));
  };

  const handleSave = () => {
    axios.put(`${config.API_URL}/profiles/${profileID}`, profileData)
      .then(() => {
        navigate('/profiles');
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
      });
  };

  const handleBack = () => {
    navigate('/profiles');
  };

  if (loading) return <p>Loading profile data...</p>;

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>

      <div className="form-group">
        <label>Profile Name:</label>
        <input
          type="text"
          name="profile"
          value={profileData.profile}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Suspended:</label>
        <select
          name="suspended"
          value={profileData.suspended}
          onChange={handleChange}
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
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
        .edit-profile-container {
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

        input, select {
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

export default EditProfile;
