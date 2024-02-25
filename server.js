const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Empty password
  database: 'mob'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query MySQL to check if the user exists
  const query = `SELECT * FROM credentials WHERE username = ? AND password = ?`;
  connection.query(query, [username, password], (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // User found, login successful
      res.json({ success: true, message: 'Login successful' });
    } else {
      // No user found with provided credentials
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
