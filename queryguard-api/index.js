const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Parse JSON from incoming requests
app.use(express.json());

// Serve static files from React build output
const distPath = path.resolve(__dirname, '../queryguard-react-ui/dist');
app.use(express.static(distPath));

// API route for log middleware
app.post('/log', (req, res) => {
  console.log('Received log:', req.body);
  res.status(200).json({ message: 'Log received' });
});

// All other routes should serve the frontend (SPA routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
