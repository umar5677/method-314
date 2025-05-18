import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function HomeHO() {
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

  const handleUserAccountClick = () => {
    navigate('/allservices');
  };

  const handleUserDetailsClick = () => {
    navigate('/hoshortlists');
  };

  const handleLogout = () => {
    Cookies.remove('user');
    navigate('/');
  };

  return (
    <div className="home-container">
      {user && (
        <>
          <h2 className="welcome-message">Welcome, {user.username}!</h2>
          {/* <p className="user-profile">{user.profile}</p> */}
        </>
      )}
      <h1 className="home-title">Home Owner Dashboard</h1>
      <div className="button-container">
        <button className="action-button" onClick={handleUserAccountClick}>
          View all services
        </button>
        <button className="action-button" onClick={handleUserDetailsClick}>
          Shortlisted Services
        </button>
      </div>
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

        .welcome-message {
          font-size: 1.5rem;
          color: #7c3aed;
          margin-bottom: 20px;
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

export default HomeHO;
