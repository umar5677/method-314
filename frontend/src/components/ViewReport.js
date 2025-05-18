import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';  // Assuming you have a config.js with API_URL

const ViewReport = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]); // Unified state for data
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('day'); // 'day', 'week', 'month'
  // Default start date: Jan 1, 2020, or a more dynamic recent default like 30 days ago
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(2020); // Example: Start from 2020
    date.setMonth(0);       // January
    date.setDate(1);        // 1st
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default end date: today
  const [error, setError] = useState(null);

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/'); // If no user is logged in, navigate to login page
    }
  }, [userId, navigate]);

  const fetchReportData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setReportData([]); // Clear previous data

    let endpoint = '';
    // startDate and endDate are required for weekly and monthly,
    // and used for filtering daily.
    if (!startDate || !endDate) {
        setError("Please select both a start and end date.");
        setLoading(false);
        return;
    }

    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
    }).toString();

    switch (view) {
      case 'day':
        endpoint = `${config.API_URL}/logs/daily?${params}`;
        break;
      case 'week':
        endpoint = `${config.API_URL}/logs/weekly?${params}`;
        break;
      case 'month':
        endpoint = `${config.API_URL}/logs/monthly?${params}`;
        break;
      default:
        setError('Invalid view type selected.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.get(endpoint);
      setReportData(response.data);
    } catch (err) {
      console.error(`Error fetching ${view}ly logs:`, err.response || err);
      setError(err.response?.data?.error || `Failed to retrieve ${view}ly logs. Ensure date range is valid.`);
    } finally {
      setLoading(false);
    }
  }, [view, startDate, endDate, userId]); // Include userId in dependencies

  useEffect(() => {
    // Fetch data when component mounts or when view/date range/user changes
    if (userId) { // Only fetch if user is available
        fetchReportData();
    }
  }, [fetchReportData, userId]); // fetchReportData is memoized, userId ensures re-fetch on login/logout if applicable

  const handleBack = () => {
    navigate('/home');
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
    // Data will be refetched by the useEffect hook due to 'view' changing
  };
  
  const formatDateForDisplay = (dateString) => {
    // Input dateString is 'YYYY-MM-DD'
    // Create date as UTC to avoid timezone shifts, then format
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString(undefined, { timeZone: 'UTC' }); // Or specify a fixed locale/timezone
  };
  
  const formatMonthDataForDisplay = (item) => {
    // item.month is 1-indexed
    const date = new Date(item.year, item.month - 1, 1); // Day 1 of the month
    return `${date.toLocaleString('default', { month: 'long' })} ${item.year}`;
  };

  if (!userId) {
    // This case should ideally be handled by the redirect, but it's a fallback.
    return <p>Authenticating... If redirection doesn't occur, please login again.</p>;
  }

  return (
    <div className="report-container">
      <button className="back-button" onClick={handleBack}>
        ← Back to Home
      </button>

      <h1>View Report</h1>

      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>Error: {error}</p>}

      <div className="view-buttons">
        {['day', 'week', 'month'].map(viewType => (
          <button
            key={viewType}
            className={`view-button ${view === viewType ? 'active' : ''}`}
            onClick={() => handleViewChange(viewType)}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}ly
          </button>
        ))}
      </div>

      <div className="date-filter">
        <label htmlFor="startDate">From: </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <label htmlFor="endDate">To: </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          min={startDate} // Optional: prevent end date from being before start date
        />
      </div>
      
      {loading ? <p>Loading report...</p> : (
        reportData.length === 0 && !error ? <p>No data available for the selected period and view.</p> : (
          <>
            {view === 'day' && (
              <div className="stats-section">
                <h2>Daily Stats</h2>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Cleaner Count</th>
                      <th>Homeowner Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((log, index) => (
                      <tr key={index}>
                        <td>{formatDateForDisplay(log.log_date)}</td>
                        <td>{log.cleaner_count}</td>
                        <td>{log.homeowner_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {view === 'week' && (
              <div className="stats-section">
                <h2>Weekly Stats</h2>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Week Start</th>
                      <th>Week End</th>
                      <th>Cleaner Count</th>
                      <th>Homeowner Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((week, index) => (
                      <tr key={index}>
                        <td>{formatDateForDisplay(week.week_start)}</td>
                        <td>{formatDateForDisplay(week.week_end)}</td>
                        <td>{week.cleaner_count}</td>
                        <td>{week.homeowner_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {view === 'month' && (
              <div className="stats-section">
                <h2>Monthly Stats</h2>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Cleaner Count</th>
                      <th>Homeowner Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((monthItem, index) => (
                      <tr key={index}>
                        <td>{formatMonthDataForDisplay(monthItem)}</td>
                        <td>{monthItem.cleaner_count}</td>
                        <td>{monthItem.homeowner_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )
      )}

      {/* Styles (remain the same as in your original code) */}
      <style>{`
        /* ... Your existing styles ... */
        .report-container {
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

        h1 {
          color: #4f46e5;
          text-align: center;
          margin-bottom: 2rem;
        }

        .view-buttons {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .view-button {
          padding: 10px 20px;
          background-color: transparent;
          border: 2px solid #4f46e5;
          color: #4f46e5;
          border-radius: 8px;
          cursor: pointer;
          margin: 0 1rem;
          transition: all 0.3s ease;
          text-transform: capitalize; /* For 'Dayly' -> 'Daily' etc. */
        }

        .view-button:hover {
          background-color: #4f46e5;
          color: white;
        }

        .view-button.active {
          background-color: #4f46e5;
          color: white;
        }

        .date-filter {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          font-size: 1rem;
        }

        .date-filter label {
          font-weight: bold;
        }

        .date-filter input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .stats-section {
          margin-bottom: 2rem;
        }

        .stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .stats-table th, .stats-table td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: center;
        }

        .stats-table th {
          background-color: #4f46e5;
          color: white;
        }

        .stats-table tr:nth-child(even) {
          background-color: #f3f4f6; /* Slightly adjusted for contrast */
        }
        .stats-table tr:hover {
          background-color: #e9e7fd;
        }
      `}</style>
    </div>
  );
};

export default ViewReport;