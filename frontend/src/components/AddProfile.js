import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const AddProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ profile: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSave = () => {
    if (!profileData.profile.trim()) {
      alert('Please enter a profile name');
      return;
    }
    console.log(profileData)

    axios.post(`${config.API_URL}/profiles`, { profile: profileData.profile })
      .then(() => {
        alert('Profile created successfully!');
        navigate('/profiles');
      })
      .catch((error) => {
        console.error('Failed to create profile:', error);
        alert('Failed to create profile. Please try again.');
      });
  };

  const handleBack = () => {
    navigate('/profiles');
  };

  return (
    <div className="edit-profile-container">
      <h1>Add New Profile</h1>

      <div className="form-group">
        <label>Profile Name:</label>
        <input
          type="text"
          name="profile"
          value={profileData.profile}
          onChange={handleChange}
          placeholder="Enter profile name"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="save-button" onClick={handleSave}>
          Create Profile
        </button>
        <button type="button" className="cancel-button" onClick={handleBack}>
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

export default AddProfile;
