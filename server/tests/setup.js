// setup.js
import { MySqlContainer } from "@testcontainers/mysql";
import { initialiseDB } from "../db.js";
import mysql from "mysql2/promise";

let initQuery = `
DROP TABLE IF EXISTS views;
DROP TABLE IF EXISTS shortlists;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS profiles;


CREATE TABLE profiles (
  profileID INT AUTO_INCREMENT PRIMARY KEY,
  profile VARCHAR(255) NOT NULL UNIQUE,
  suspended BOOLEAN DEFAULT FALSE
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile VARCHAR(255) NOT NULL,
  suspended BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (profile)
    REFERENCES profiles(profile)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE categories (
  categoryID INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE services (
  serviceID INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  cleanerID INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  view INT DEFAULT 0,
  shortlistCount INT DEFAULT 0,

  FOREIGN KEY (category) REFERENCES categories(category)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  FOREIGN KEY (cleanerID) REFERENCES accounts(id),

  CONSTRAINT unique_cleaner_service UNIQUE (cleanerID, category)
);


CREATE TABLE views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serviceID INT NOT NULL,
  accountID INT NOT NULL,
  FOREIGN KEY (serviceID) REFERENCES services(serviceID) ON DELETE CASCADE,
  FOREIGN KEY (accountID) REFERENCES accounts(id),
  UNIQUE (serviceID, accountID)
);

-- Create the table
CREATE TABLE shortlists (
  shortlistID INT AUTO_INCREMENT PRIMARY KEY,
  serviceID INT NOT NULL,
  hownerID INT NOT NULL,

  FOREIGN KEY (serviceID) REFERENCES services(serviceID) ON DELETE CASCADE,
  FOREIGN KEY (hownerID) REFERENCES accounts(id),

  -- Ensure that a homeowner cannot shortlist the same service multiple times
  CONSTRAINT unique_shortlist UNIQUE (serviceID, hownerID)
);

CREATE TABLE logs (
  logID INT AUTO_INCREMENT PRIMARY KEY,
  log_date DATE NOT NULL UNIQUE,
  cleaner_count INT NOT NULL,
  homeowner_count INT NOT NULL
);
`;

const insertDataQuery = `
INSERT INTO logs (log_date, cleaner_count, homeowner_count)
SELECT
  DATE_ADD('2025-01-01', INTERVAL seq DAY) AS log_date,
  FLOOR(50 + RAND() * 50) AS cleaner_count,    -- Random number between 50-99
  FLOOR(100 + RAND() * 100) AS homeowner_count  -- Random number between 100-199
FROM (
  SELECT @row := @row + 1 AS seq
  FROM 
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
     UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t1,
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
     UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t2,
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
     UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t3,
    (SELECT @row := -1) r
) numbers
WHERE DATE_ADD('2025-01-01', INTERVAL seq DAY) <= '2025-04-20';

INSERT INTO profiles (profile)
VALUES 
  ('useradmin'),
  ('cleaner'),
  ('homeowner'),
  ('platformmanager');


INSERT INTO accounts (username, password, profile)
VALUES 
  ('useradmin', 'pwd', 'useradmin'),
  ('cleaner', 'pwd', 'cleaner'),
  ('homeowner', 'pwd', 'homeowner'),
  ('platform manager', 'pwd', 'platformmanager');
  
INSERT INTO categories (category)
VALUES
  ('Residential Cleaning'),
  ('Commercial Cleaning'),
  ('Carpet Cleaning'),
  ('Window Cleaning'),
  ('Deep Cleaning');
  
INSERT INTO services (category, cleanerID, price)
VALUES
  ('Commercial Cleaning', 2, 75.00),
  ('Carpet Cleaning', 3, 40.00),
  ('Window Cleaning', 1, 30.00);
  
INSERT INTO views (serviceID, accountID) 
VALUES 
  (3, 1),  
  (3, 2),
  (3, 3);
  
UPDATE services s
JOIN (
    SELECT serviceID, COUNT(*) AS view_count
    FROM views
    GROUP BY serviceID
) v ON s.serviceID = v.serviceID
SET s.view = v.view_count;

-- Insert sample data into shortlists
INSERT INTO shortlists (serviceID, hownerID)
VALUES
  (2, 2),
  (3, 1);
  
UPDATE services s
JOIN (
  SELECT serviceID, COUNT(*) AS shortlist_count
  FROM shortlists
  GROUP BY serviceID
) st ON s.serviceID = st.serviceID
SET s.shortlistCount = st.shortlist_count;
`;

let container;
export async function setup() {
  const username = "test";
  const pw = "pwd";
  const databaseName = "cleanerDB";
  container = await new MySqlContainer()
    .withUsername(username)
    .withUserPassword(pw)
    .withDatabase(databaseName)
    .start();
  const conn = await mysql.createConnection({
    host: container.getHost(),
    user: username,
    password: pw,
    database: databaseName,
    port: container.getPort(),
    multipleStatements: true,
  });

  await conn.connect();

  await conn.query(initQuery);
  await conn.query(insertDataQuery);

  conn.destroy();

  initialiseDB(
    container.getHost(),
    username,
    pw,
    databaseName,
    container.getPort()
  );
}

export async function teardown() {
  await container.stop();
}

export { container };
