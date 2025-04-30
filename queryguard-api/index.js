const express = require('express');
const path = require('path');
const app = express();
const pool = require('./db');

const PORT = process.env.PORT || 3000;

// Parse JSON from incoming requests
app.use(express.json());

// Serve static files from React build output
const distPath = path.resolve(__dirname, '../queryguard-react-ui/dist');
app.use(express.static(distPath));

// API route for log middleware
app.post('/log', async (req, res) => {
  const { method, endpoint, ip, timestamp, body } = req.body;

  try {
    // Look up user_id based on registered IP
    const result = await pool.query(
      'SELECT id FROM users WHERE registered_ip = $1',
      [ip]
    );

    if (result.rows.length === 0) {
      console.warn(`No matching user found for IP: ${ip}`);
      return res.status(400).json({ message: 'No matching user for IP' });
    }

    const user_id = result.rows[0].id;

    const insertQuery = `
      INSERT INTO logs (method, endpoint, ip, timestamp, request_body, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [method, endpoint, ip, timestamp, body, user_id];
    await pool.query(insertQuery, values);

    console.log(`Log inserted for user_id ${user_id}`);
    res.status(200).json({ message: 'Log stored successfully' });

  } catch (err) {
    console.error('Error handling /log:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      console.log(`User ${username} logged in successfully.`);
      res.status(200).json({ message: 'Login successful' });
    } else {
      console.log(`Failed login attempt for ${username}.`);
      res.status(401).json({ message: 'Invalid username or password' });
    }

  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password, registered_ip } = req.body;

  try {
    // Check if username already exists
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Insert new user
    await pool.query(
      'INSERT INTO users (username, password, registered_ip) VALUES ($1, $2, $3)',
      [username, password, registered_ip]
    );

    console.log(`New user created: ${username}`);
    res.status(201).json({ message: 'Account created successfully' });

  } catch (err) {
    console.error('Error creating account:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// All other routes should serve the frontend (SPA routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
