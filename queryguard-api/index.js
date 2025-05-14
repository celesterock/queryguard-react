const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const pool = require('./db');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
  secret: 'queryguard-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure: true for HTTPS
}));

const distPath = path.resolve(__dirname, '../queryguard-react-ui/dist');
app.use(express.static(distPath));

// LOGIN: Sets session
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      req.session.user_id = user.id;
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// REGISTER
app.post('/register', async (req, res) => {
  const { username, password, registered_ip } = req.body;
  try {
    const exists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (exists.rows.length > 0) return res.status(409).json({ message: 'Username exists' });

    await pool.query(
      'INSERT INTO users (username, password, registered_ip) VALUES ($1, $2, $3)',
      [username, password, registered_ip]
    );
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * Normalize IP address format.
 */
function normalizeIp(ip) {
  if (!ip) return 'unknown';
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

/**
 * Parse request body and return the first field that the model flags as malicious.
 * Returns { value, prediction } where prediction is 0 or 1.
 */
async function extractMaliciousField(body) {
  if (!body || typeof body !== 'object') return { value: '', prediction: 0 };

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        const { data } = await axios.post('http://localhost:8000/predict', {
          query: value,
        });

        const modelPrediction = data.prediction; // Expecting 0 or 1
        if (modelPrediction === 1) {
          return { value, prediction: 1 };
        }
      } catch (err) {
        console.warn('Prediction error for field:', key, err.message);
      }
    }
  }

  return { value: '', prediction: 0 };
}

/**
 * Log endpoint that receives web requests from client sites.
 */
app.post('/log', async (req, res) => {
  const { method, endpoint, ip: rawIp, timestamp, body, headers } = req.body;

  try {
    const senderIp = normalizeIp(rawIp);

    // Lookup user by IP
    const userResult = await pool.query(
      'SELECT id FROM users WHERE registered_ip = $1 LIMIT 1',
      [senderIp]
    );

    if (userResult.rows.length === 0) {
      console.warn(`No matching user found for sender IP: ${senderIp}`);
      return res.status(400).json({ message: 'No matching user for sender IP' });
    }

    const userId = userResult.rows[0].id;

    // Extract potential SQLi string and prediction
    const { value: maliciousInput, prediction } = await extractMaliciousField(body);

    // Store the result (replacing full JSON with the suspicious string)
    const insertQuery = `
      INSERT INTO logs (method, endpoint, ip, timestamp, request_body, user_id, prediction)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(insertQuery, [
      method || 'UNKNOWN',
      endpoint || 'unknown',
      senderIp,
      timestamp || new Date().toISOString(),
      maliciousInput || '[no suspicious input detected]',
      userId,
      prediction
    ]);

    console.log(`Log inserted for user ${userId} (IP ${senderIp}) → Prediction: ${prediction}`);
    res.status(200).json({ message: 'Log stored successfully', prediction });

  } catch (err) {
    console.error('Error in /log:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// DASHBOARD API: Only for logged-in user
function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
}

// Common Injections
app.get('/api/common-injections', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT request_body, COUNT(*) AS count, MAX(timestamp) AS latest_time
      FROM logs
      WHERE prediction = 1 AND user_id = $1
      GROUP BY request_body
      ORDER BY count DESC, latest_time DESC
      LIMIT 10
    `, [req.session.user_id]);

    res.json(rows.map(row => ({
      injection: row.request_body,
      count: parseInt(row.count),
      latest_time: row.latest_time,
    })));
  } catch (err) {
    console.error('common-injections error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/recent-injections', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT request_body, timestamp
      FROM logs
      WHERE prediction = 1 AND user_id = $1
      ORDER BY timestamp DESC
      LIMIT 20
    `, [req.session.user_id]);

    res.json(rows.map(row => ({
      injection: typeof row.request_body === 'string'
        ? row.request_body
        : JSON.stringify(row.request_body), // 🛠 force stringify if it's an object
      timestamp: row.timestamp,
    })));
  } catch (err) {
    console.error('Error in /api/recent-injections:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});



// Most Recent IPs
app.get('/api/most-recent-ips', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ip
      FROM (
        SELECT ip, MAX(timestamp) AS latest_time
        FROM logs
        WHERE user_id = $1
        GROUP BY ip
      ) AS recent_ips
      ORDER BY latest_time DESC
      LIMIT 10;
    `, [req.session.user_id]);

    res.json(rows.map(row => row.ip));
  } catch (err) {
    console.error('most-recent-ips error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/top-attacked-endpoints', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        SPLIT_PART(endpoint, '?', 1) AS normalized_endpoint,
        COUNT(*) AS count
      FROM logs
      WHERE prediction = 1 AND user_id = $1
      GROUP BY normalized_endpoint
      ORDER BY count DESC
      LIMIT 10
    `, [req.session.user_id]);

    res.json(rows.map(row => ({
      endpoint: row.normalized_endpoint,
      count: parseInt(row.count)
    })));
  } catch (err) {
    console.error('Error in /api/top-attacked-endpoints:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/logs-by-ip', requireLogin, async (req, res) => {
  const ip = req.query.ip;

  try {
    const { rows } = await pool.query(`
      SELECT request_body, method, endpoint, timestamp
      FROM logs
      WHERE user_id = $1 AND ip = $2 AND prediction = 1
      ORDER BY timestamp DESC
      LIMIT 50
    `, [req.session.user_id, ip]);

    res.json(rows);
  } catch (err) {
    console.error('Error in /api/logs-by-ip:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/logs-by-endpoint', requireLogin, async (req, res) => {
  const endpoint = req.query.path;

  try {
    const { rows } = await pool.query(`
      SELECT request_body, method, timestamp
      FROM logs
      WHERE user_id = $1 AND SPLIT_PART(endpoint, '?', 1) = $2 AND prediction = 1
      ORDER BY timestamp DESC
      LIMIT 50
    `, [req.session.user_id, endpoint]);

    res.json(rows);
  } catch (err) {
    console.error('Error in /api/logs-by-endpoint:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});



// Serve React App
app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
