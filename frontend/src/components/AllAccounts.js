import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const AllAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.API_URL}/users`)
      .then((response) => {
        setAccounts(response.data);
        setFilteredAccounts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch user accounts:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = accounts.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchTerm, accounts]);

  const handleBackToMainMenu = () => {
    navigate('/home');
  };

  const handleAddAccount = () => {
    navigate('/addaccount');
  };

  const handleEdit = (userId) => {
    navigate(`/edit-account/${userId}`);
  };

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div className="accounts-container">
      <div className="header-container">
        <button className="back-to-main-menu-button" onClick={handleBackToMainMenu}>
          ← Back to Main Menu
        </button>
        <button className="add-account-button" onClick={handleAddAccount}>
          + Add Account
        </button>
      </div>

      <h1>All User Accounts</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="accounts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Profile</th>
            <th>Suspended</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.profile}</td>
              <td>{user.suspended ? 'Yes' : 'No'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user.id)}>
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
          margin-bottom: 1.5rem;
        }

        .back-to-main-menu-button,
        .add-account-button {
          background-color: #4f46e5;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .back-to-main-menu-button:hover,
        .add-account-button:hover {
          background-color: #6366f1;
        }

        h1 {
          color: #4f46e5;
          margin-bottom: 1rem;
          text-align: center;
        }

        .search-bar-container {
          text-align: center;
          margin-bottom: 1rem;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }

        .accounts-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
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

export default AllAccounts;
