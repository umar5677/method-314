// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function HomePS() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = Cookies.get('user');
    if (!userData) {
      navigate('/');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
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
      <h1 className="suspended-title">{user?.profile} profile has been suspended!</h1>
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

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

        /* Changed this selector */
        .suspended-title {
          font-size: 2rem;
          color: #ef4444;  /* Red color */
          margin-bottom: 30px;
          text-shadow: 0 1px 1px rgba(0,0,0,0.1);
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
          width: 200px;
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
          width: 200px;
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

export default HomePS;
