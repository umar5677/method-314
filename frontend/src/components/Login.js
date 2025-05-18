// src/components/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import config from '../config'; // Import the config file

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the username and password to the backend
    try {
      const response = await fetch(`${config.API_URL}/login`, { // Use the API URL from config
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Extract relevant data from response (id, username, profile)
        const { id, username: user, profile } = data.user;

        // Set these values in the cookie
        Cookies.set('user', JSON.stringify({ id, username: user, profile }), { expires: 1 });

        // Navigate to the home page
        navigate('/home');
      } else {
        // Handle error if login fails
        const errorData = await response.json();
        setError(errorData.message || 'Invalid credentials');
        
        // Display an alert with the error message
        alert(errorData.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Error connecting to the server');
      
      // Display an alert with the error message
      alert('Error connecting to the server');
    }
  };
  return (
    <div className="app-container">
      <div className="card">
        {/* Login Section */}
        <div className="login-section">
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Login to your cleaning services dashboard</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div>
            <h3>Cleaning Services Management</h3>
            <p>Easily manage appointments, customer details, and staff schedules with our intuitive dashboard.</p>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body, .app-container {
          margin: 0;
          padding: 0;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to top right, #e9d5ff, #bfdbfe);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1100px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 768px) {
          .card {
            flex-direction: row;
          }
        }

        .login-section {
          flex: 1;
          padding: 40px;
        }

        .title {
          font-size: 2rem;
          color: #7c3aed;
          text-align: center;
          margin-bottom: 10px;
        }

        .subtitle {
          text-align: center;
          color: #4b5563;
          margin-bottom: 30px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group label {
          font-size: 0.9rem;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .form-options a {
          color: #7c3aed;
          text-decoration: none;
        }

        .form-options input {
          margin-right: 6px;
        }

        button {
          padding: 12px;
          background-color: #7c3aed;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #6d28d9;
        }

        .signup {
          margin-top: 25px;
          text-align: center;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .signup a {
          color: #7c3aed;
          text-decoration: none;
        }

        .preview-section {
          display: none;
          background: linear-gradient(to top right, #7c3aed, #4338ca);
          color: white;
          padding: 40px;
          flex: 1;
          text-align: center;
          align-items: center;
          justify-content: center;
        }

        .preview-section h3 {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }

        .preview-section p {
          font-size: 0.95rem;
          color: #ddd6fe;
        }

        @media (min-width: 768px) {
          .preview-section {
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
