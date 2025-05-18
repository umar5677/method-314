const db = require('../db'); // Use the path to your db.js

class UserProfileEntity {
  // Get all profiles
  getAllProfiles() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM profiles', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Add a profile
  addProfile(profile, suspended = false) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO profiles (profile, suspended) VALUES (?, ?)';
      db.query(query, [profile, suspended], (err, results) => {
        if (err) return reject(err);
        resolve({ profile, suspended });
      });
    });
  }

  // Update a profile based on profileID
  updateProfileByID(profileID, updatedData) {
    return new Promise((resolve, reject) => {
      const { profile, suspended } = updatedData;
      const query = 'UPDATE profiles SET profile = ?, suspended = ? WHERE profileID = ?';

      db.query(query, [profile, suspended, profileID], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) return reject('Profile not found');
        resolve({ profileID, profile, suspended });
      });
    });
  }
}

module.exports = new UserProfileEntity();
