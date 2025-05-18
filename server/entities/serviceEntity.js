const db = require('../db');

class ServiceEntity {
  // Get all services
  getAllServices() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM services', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // Get service by ID
  getServiceById(serviceID) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM services WHERE serviceID = ?', [serviceID], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject('Service not found');
        resolve(results[0]);
      });
    });
  }

  // Get services by Cleaner ID
  getServicesByCleanerId(cleanerID) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM services WHERE cleanerID = ?', [cleanerID], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject('No services found for this cleaner');
        resolve(results);
      });
    });
  }

  // Add a service
  addService(category, cleanerID, price) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO services (category, cleanerID, price) VALUES (?, ?, ?)';
      db.query(query, [category, cleanerID, price], (err, results) => {
        if (err) return reject(err);
        resolve({ serviceID: results.insertId, category, cleanerID, price });
      });
    });
  }

  // Update a service
  updateService(serviceID, updatedData) {
    return new Promise((resolve, reject) => {
      const { category, cleanerID, price } = updatedData;
      const query = 'UPDATE services SET category = ?, cleanerID = ?, price = ? WHERE serviceID = ?';
      db.query(query, [category, cleanerID, price, serviceID], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) return reject('Service not found');
        resolve({ serviceID, ...updatedData });
      });
    });
  }

  // Delete a service
  deleteService(serviceID) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM services WHERE serviceID = ?';
      db.query(query, [serviceID], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) return reject('Service not found');
        resolve({ message: 'Service deleted successfully' });
      });
    });
  }

  // Get services by hownerID via shortlist
  getServicesByHownerId(hownerID) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT * FROM services 
      WHERE serviceID IN (
        SELECT serviceID FROM shortlists WHERE hownerID = ?
      )
    `;
      db.query(query, [hownerID], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject('No services found for this homeowner');
        resolve(results);
      });
    });
  }
}

module.exports = new ServiceEntity();