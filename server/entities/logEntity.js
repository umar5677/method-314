const db = require('../db'); // Ensure this path is correct

class LogEntity {
  getDailyLogs(startDate, endDate) { // startDate and endDate can be undefined
    return new Promise((resolve, reject) => {
      let query = 'SELECT log_date, cleaner_count, homeowner_count FROM logs';
      const queryParams = [];

      if (startDate && endDate) {
        if (!isNaN(new Date(startDate).getTime()) && !isNaN(new Date(endDate).getTime())) {
            query += ' WHERE log_date BETWEEN ? AND ?';
            queryParams.push(startDate, endDate);
        } else {
            console.warn('getDailyLogs (Entity): Received invalid date formats, fetching all logs instead.');
            // If dates are invalid, effectively ignore them to fetch all
        }
      } else if (startDate && !isNaN(new Date(startDate).getTime())) {
        query += ' WHERE log_date >= ?';
        queryParams.push(startDate);
      } else if (endDate && !isNaN(new Date(endDate).getTime())) {
        query += ' WHERE log_date <= ?';
        queryParams.push(endDate);
      }
      // If neither, or only one invalid date is provided, it fetches all logs (or filtered by one valid date).

      query += ' ORDER BY log_date ASC;';

      db.query(query, queryParams, (err, results) => {
        if (err) return reject(err);
        // log_date from MySQL DATE type is already a 'YYYY-MM-DD' string
        // Ensure results are what frontend expects: { log_date, cleaner_count, homeowner_count }
        resolve(results.map(row => ({
            log_date: row.log_date, // Already 'YYYY-MM-DD' string if DATE type
            cleaner_count: row.cleaner_count,
            homeowner_count: row.homeowner_count,
        })));
      });
    });
  }

  getWeeklyLogs(startDate, endDate) { // startDate and endDate are expected to be valid
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
            DATE_FORMAT(MIN(log_date), '%Y-%m-%d') AS week_start, 
            DATE_FORMAT(MAX(log_date), '%Y-%m-%d') AS week_end,
            SUM(cleaner_count) AS cleaner_count,
            SUM(homeowner_count) AS homeowner_count
        FROM logs
        WHERE log_date BETWEEN ? AND ?
        GROUP BY YEARWEEK(log_date, 1) -- Mode 1: Week starts on Monday, range 0-53
        ORDER BY week_start ASC;
      `;
      db.query(query, [startDate, endDate], (err, results) => {
        if (err) return reject(err);
        // No need to map here if week_start and week_end are already formatted by SQL
        resolve(results);
      });
    });
  }

  getMonthlyLogs(startDate, endDate) { // startDate and endDate are expected to be valid
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
            YEAR(log_date) AS year,
            MONTH(log_date) AS month, -- Changed month_numeric to month for clarity
            SUM(cleaner_count) AS cleaner_count,
            SUM(homeowner_count) AS homeowner_count
        FROM logs
        WHERE log_date BETWEEN ? AND ?
        GROUP BY year, month
        ORDER BY year ASC, month ASC;
      `;
      db.query(query, [startDate, endDate], (err, results) => {
        if (err) return reject(err);
        // Results are already in { year, month, cleaner_count, homeowner_count } format
        resolve(results);
      });
    });
  }

   // Fetch all logs (kept for potential other uses or if '/logs/all' endpoint is used)
  getLogs() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT log_id AS logID, log_date, cleaner_count, homeowner_count FROM logs ORDER BY log_date DESC;'; // Ensure column names match schema if needed
      db.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results.map(row => ({
            logID: row.logID,
            log_date: row.log_date, // Already 'YYYY-MM-DD'
            cleaner_count: row.cleaner_count,
            homeowner_count: row.homeowner_count,
        })));
      });
    });
  }
}

module.exports = new LogEntity();