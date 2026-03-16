const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    message: 'Claude CRM API Server',
    version: '1.0.0',
    phase: 1,
    note: 'Phase 1 uses mock data - this server acts as a dev proxy'
  });
});

app.listen(PORT, () => {
  console.log(`CRM Server running on http://localhost:${PORT}`);
});
