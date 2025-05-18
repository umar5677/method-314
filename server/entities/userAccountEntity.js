const db = require('../db'); // Use the path to your db.js

class UserAccountEntity {
  // Login user
  loginUser(username, password) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM accounts WHERE username = ? AND password = ?';
      db.query(query, [username, password], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject('Invalid username or password');
        resolve(results[0]);
      });
    });
  }

  // Get all users
  getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM accounts', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Get a user by ID
  getUserById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM accounts WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject('User not found');
        resolve(results[0]);
      });
    });
  }

  // Add a user
  addUser(username, password, profile, suspended = false) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO accounts (username, password, profile, suspended) VALUES (?, ?, ?, ?)';
      db.query(query, [username, password, profile, suspended], (err, results) => {
        if (err) return reject(err);
        resolve({ id: results.insertId, username, password, profile, suspended });
      });
    });
  }

  // Update user
  updateUser(id, updatedData) {
    return new Promise((resolve, reject) => {
      const { username, password, profile, suspended } = updatedData;
      const query = 'UPDATE accounts SET username = ?, password = ?, profile = ?, suspended = ? WHERE id = ?';
      db.query(query, [username, password, profile, suspended, id], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) return reject('User not found');
        resolve({ id, ...updatedData });
      });
    });
  }
}

module.exports = new UserAccountEntity();
