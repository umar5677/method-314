// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function HomeD() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from the cookie
    const userData = Cookies.get('user');
    if (!userData) {
      // If no user cookie, redirect to login page
      navigate('/');
    } else {
      // Parse user data and set it to state
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove the 'user' cookie and redirect to login page
    Cookies.remove('user');
    navigate('/');
  };

  return (
    <div className="home-container">
      {user && (
        <>
          <div className="user-info">
            <h2 className="user-name">Welcome, {user.username}!</h2>
            <p className="user-profile">profile: {user.profile}</p>
          </div>
        </>
      )}
      <h1 className="home-title">Default Dashboard</h1>
      {/* Logout Button */}
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Inline CSS */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body, .home-container {
          margin: 0;
          padding: 0;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to top right, #e9d5ff, #bfdbfe);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .home-container {
          text-align: center;
        }

        .user-info {
          margin-bottom: 20px;
        }

        .user-name {
          font-size: 1.5rem;
          color: #7c3aed;
          margin: 0;
        }

        .user-profile {
          font-size: 1rem;
          color: #4b5563;
        }

        .home-title {
          font-size: 2rem;
          color: #7c3aed;
          margin-bottom: 30px;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .action-button {
          padding: 12px;
          background-color: #7c3aed;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 200px; /* Button width */
          margin: 10px;
        }

        .action-button:hover {
          background-color: #6d28d9;
        }

        .logout-container {
          margin-top: 30px;
        }

        .logout-button {
          padding: 12px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 200px; /* Button width */
        }

        .logout-button:hover {
          background-color: #dc2626;
        }

        @media (min-width: 768px) {
          .button-container {
            flex-direction: row;
            justify-content: center;
          }

          .action-button {
            margin: 0 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default HomeD;
