import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const AddAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: '',
    profile: '',
    suspended: false
  });
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get(`${config.API_URL}/profiles`)
      .then((response) => {
        setProfiles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profiles:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${config.API_URL}/users`, user)
      .then(() => {
        alert('User added successfully');
        navigate('/accounts');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        alert('Failed to add user. Please try again.');
      });
  };

  return (
    <div className="edit-account-container">
      <h1>Add New User Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile">Profile</label>
          <select
            id="profile"
            name="profile"
            value={user.profile}
            onChange={handleChange}
            required
          >
            <option value="">Select a profile</option>
            {profiles.map((profile) => (
              <option key={profile.profileID} value={profile.profile}>
                {profile.profile}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="suspended">Suspended</label>
          <label className="switch">
            <input
              type="checkbox"
              id="suspended"
              name="suspended"
              checked={user.suspended}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Create Account</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/accounts')}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        .edit-account-container {
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
          max-width: 400px;
          margin: 0 auto;
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

        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 34px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 50px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 12px;
          width: 12px;
          border-radius: 50px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #4f46e5;
        }

        input:checked + .slider:before {
          transform: translateX(14px);
        }
      `}</style>
    </div>
  );
};

export default AddAccount;
