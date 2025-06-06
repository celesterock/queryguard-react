const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const session = require('express-session');
const app = express();
const pool = require('./db');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// session management for logged-in users
app.use(session({
  secret: 'queryguard-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// serves front end
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

// LOGOUT - ends session & clears cookies
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
});



// REGISTER - creates a new username, password, ip & inserts into database
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


// Normalize IP address format & formats localhost
function normalizeIp(ip) {
  if (!ip) return 'unknown';
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

// Returns location given an IP (city, region, country)
async function getLocationFromIp(ip) {
  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    if (data.status === 'success') {
      return `${data.city}, ${data.regionName}, ${data.country}`;
    }
  } catch (err) {
    console.warn(`Geolocation lookup failed for IP ${ip}:`, err.message);
  }
  return 'Unknown';
}


/**
 * Parses request body and returns the first field that the model flags as malicious.
 * Returns { value, prediction } where prediction is 0 or 1.
 */
async function extractMaliciousField(body) {
  if (!body || typeof body !== 'object') return { value: '', prediction: 0 };

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        // communication with BERT model
        const { data } = await axios.post('http://localhost:8000/predict', {
          query: value,
        });

        const modelPrediction = data.prediction;
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

// Log endpoint that receives web requests from client sites.
// Info is sent here from Middleware
app.post('/log', async (req, res) => {
  const { method, endpoint, ip: userIpRaw, timestamp, body, headers } = req.body;

  // Get client IP from the connection
  const clientIp = normalizeIp(req.headers['x-forwarded-for'] || req.socket.remoteAddress);

  // This is the end user’s IP that is making requests on the client's site
  const userIp = normalizeIp(userIpRaw);

  try {
    // Look up which QG Client sent this based on their registered server IP
    const userResult = await pool.query(
      'SELECT id FROM users WHERE registered_ip = $1 LIMIT 1',
      [clientIp]
    );

    if (userResult.rows.length === 0) {
      console.warn(`No matching user found for sender IP: ${clientIp}`);
      return res.status(400).json({ message: 'No matching user for sender IP' });
    }

    const userId = userResult.rows[0].id;

    // Run BERT model prediction on all fields in body
    const { value: maliciousInput, prediction } = await extractMaliciousField(body);

    // lookup location
    const location = await getLocationFromIp(userIp);

    // Insert the log
    const insertQuery = `
      INSERT INTO logs (method, endpoint, ip, timestamp, request_body, user_id, prediction, location)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(insertQuery, [
      method || 'UNKNOWN',
      endpoint || 'unknown',
      userIp || 'unknown',
      timestamp || new Date().toISOString(),
      maliciousInput || '[no suspicious input detected]',
      userId,
      prediction,
      location
    ]);

    // send a real time alert from server to QG Dashboard if SQLi detected
    if (prediction === 1) {
      const io = req.app.get('io');
      io.emit(`sqli:${userId}`, { timestamp: Date.now() });
    }


    console.log(`Log inserted for user ${userId} (Client IP ${clientIp}, Visitor IP ${userIp}) → Prediction: ${prediction}`);
    res.status(200).json({ message: 'Log stored successfully', prediction });

  } catch (err) {
    console.error('Error in /log:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// require logged-in user for Dashboard access
function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
}

// Common Injections: Counts the frequency of each injection query
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

// Returns the most recent injection queries enter into client's site
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
        : JSON.stringify(row.request_body),
      timestamp: row.timestamp,
    })));
  } catch (err) {
    console.error('Error in /api/recent-injections:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Returns ANY most Recent IPs connecting to client site (NOT just malicious)
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

// Returns the client's site endpoints that have logged an attack attempt
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

// returns all log data for aq given IP address 
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

// returns all log data for a given endpoint
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

// returns injections per day data for daily/weekly chart
app.get('/api/chart/injections-per-day', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT timestamp, prediction
      FROM logs
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 200
    `, [req.session.user_id]);

    res.json(rows.map(row => ({
      timestamp: row.timestamp,
      prediction: Number(row.prediction)
    })));
  } catch (err) {
    console.error('Error in /api/chart/injections-per-day:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Returns top 10 most active attacking ips
app.get('/api/top-sqli-ips', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ip, COUNT(*) AS count
      FROM logs
      WHERE prediction = 1 AND user_id = $1
      GROUP BY ip
      ORDER BY count DESC
      LIMIT 10
    `, [req.session.user_id]);

    res.json(rows.map(row => ({
      ip: row.ip,
      count: parseInt(row.count)
    })));
  } catch (err) {
    console.error('Error in /api/top-sqli-ips:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Returns sql injections by the hour for Dashboard chart
app.get('/api/injections-by-hour', requireLogin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT EXTRACT(HOUR FROM timestamp) AS hour, COUNT(*) AS count
      FROM logs
      WHERE prediction = 1 AND user_id = $1
      GROUP BY hour
      ORDER BY hour
    `, [req.session.user_id]);

    // Format as time labels (e.g., "01:00–02:00")
    const formatted = Array.from({ length: 24 }, (_, i) => {
      const label = `${String(i).padStart(2, '0')}:00–${String((i + 1) % 24).padStart(2, '0')}:00`;
      const found = rows.find(r => parseInt(r.hour) === i);
      return {
        timeRange: label,
        count: found ? parseInt(found.count) : 0
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error in /api/injections-by-hour:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Maps a continent to a list of countries
const continentMap = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia'],
  'Europe': ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Poland', 'Netherlands'],
  'Africa': ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Morocco'],
  'Asia': ['China', 'Japan', 'India', 'Russia', 'Indonesia', 'Pakistan', 'Iran'],
  'Australia': ['Australia', 'New Zealand'],
  'Antarctica': ['Antarctica']
};

// Returns the percent of attacks coming from each country
app.get('/api/continent-stats', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT location FROM logs WHERE user_id = $1`,
      [req.session.user_id]
    );

    const counts = {
      'north-america': 0,
      'south-america': 0,
      'europe': 0,
      'africa': 0,
      'asia': 0,
      'australia': 0,
      'antarctica': 0
    };

    let total = 0;

    for (let row of result.rows) {
      if (!row.location) continue;
      const match = row.location.split(',').pop().trim();
      for (let [continent, countries] of Object.entries(continentMap)) {
        if (countries.includes(match)) {
          const key = continent.toLowerCase().replace(' ', '-');
          counts[key]++;
          total++;
          break;
        }
      }
    }

    const percentages = {};
    for (let [key, count] of Object.entries(counts)) {
      percentages[key] = total > 0 ? Math.round((count / total) * 100) : 0;
    }

    res.json(percentages);
  } catch (err) {
    console.error('Error in /api/continent-stats:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Returns the list of attacking IPs and specific locations for each continent
app.get('/api/logs-by-continent', requireLogin, async (req, res) => {
  const { continent } = req.query;
  const normalizedKey = Object.keys(continentMap).find(
    key => key.toLowerCase().replace(/\s+/g, '-') === continent
  );

  if (!continent || !normalizedKey) {
    return res.status(400).json({ message: 'Invalid or missing continent' });
  }

  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ip, location
      FROM logs
      WHERE user_id = $1
        AND location IS NOT NULL
    `, [req.session.user_id]);

    const result = rows.filter(row => {
      const country = row.location.split(',').pop().trim();
      return continentMap[normalizedKey].includes(country);
    });

    res.json(result);
  } catch (err) {
    console.error('Error in /api/logs-by-continent:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Returns user id if the user is actively logged in
app.get('/me', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json({ userId: req.session.user_id });
});


// Serve React App
app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Creates Socket.IO server for real-time notifications from server -> dashboard
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io); 

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
