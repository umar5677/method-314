import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const AllProfiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.API_URL}/profiles`)
      .then((response) => {
        setProfiles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profiles:', error);
        setLoading(false);
      });
  }, []);

  const handleBackToMainMenu = () => {
    navigate('/home');
  };

  const handleAddProfile = () => {
    navigate('/addprofile');
  };

  const handleEdit = (profileID, profileName, suspended) => {
    navigate(`/edit-profile/${profileID}`, {
      state: { profile: profileName, suspended }
    });
  };

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div className="accounts-container">
      <div className="header-container">
        <button className="back-to-main-menu-button" onClick={handleBackToMainMenu}>
          ← Back to Main Menu
        </button>
        <button className="add-profile-button" onClick={handleAddProfile}>
          + Add Profile
        </button>
      </div>

      <h1>All Profiles</h1>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile Name</th>
            <th>Suspended</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.profileID}>
              <td>{profile.profileID}</td>
              <td>{profile.profile}</td>
              <td>{profile.suspended === 0 ? 'No' : 'Yes'}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(profile.profileID, profile.profile, profile.suspended)}
                >
                  🖉 Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .accounts-container {
          padding: 2rem;
          font-family: sans-serif;
          background: #f9fafb;
          min-height: 100vh;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .back-to-main-menu-button {
          background-color: #4f46e5;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .add-profile-button {
          background-color: #4f46e5;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .back-to-main-menu-button:hover,
        .add-profile-button:hover {
          background-color: #6366f1;
        }

        h1 {
          color: #4f46e5;
          margin-bottom: 1rem;
          text-align: center;
        }

        .accounts-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
        }

        .accounts-table th, .accounts-table td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: left;
        }

        .accounts-table th {
          background-color: #f3f4f6;
          color: #374151;
        }

        .accounts-table tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .edit-button {
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .edit-button:hover {
          background-color: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default AllProfiles;
