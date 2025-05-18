// db.js
const mysql = require('mysql2');
require('dotenv').config(); // This line loads the .env file

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306 // Use environment variable or default
});

// Optional: Test the connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    // Potentially exit the application if DB connection is critical at startup
    // process.exit(1); 
    return;
  }
  console.log('Successfully connected to the database as ID ' + db.threadId);
});

module.exports = db;