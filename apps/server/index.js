const express = require('express');
const cors = require('cors');
const { verifyToken, requirePermission } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info (public)
app.get('/api', (req, res) => {
  res.json({
    message: 'Claude CRM API Server',
    version: '1.0.0',
    phase: 1,
    note: 'Phase 1 uses mock data - this server acts as a dev proxy',
    auth: 'Phase 2: All /api/* routes will require Authorization: Bearer <google-id-token>',
  });
});

// All API routes require auth
app.use('/api', verifyToken);

// Example: GET /api/clients - requires 'view' on clients
app.get('/api/clients', requirePermission('clients', 'view'), (req, res) => {
  res.json({ message: 'Phase 2: Returns clients from BigQuery', user: req.user.email });
});

// Example: POST /api/clients - requires 'edit' on clients
app.post('/api/clients', requirePermission('clients', 'edit'), (req, res) => {
  res.json({ message: 'Phase 2: Creates client in BigQuery' });
});

// Example: DELETE /api/clients/:id - requires 'full' on clients
app.delete('/api/clients/:id', requirePermission('clients', 'full'), (req, res) => {
  res.json({ message: 'Phase 2: Deletes client in BigQuery' });
});

// Example: GET /api/sales - requires 'view' on sales
app.get('/api/sales', requirePermission('sales', 'view'), (req, res) => {
  res.json({ message: 'Phase 2: Returns sales pipeline from BigQuery', user: req.user.email });
});

// Example: GET /api/production - requires 'view' on production
app.get('/api/production', requirePermission('production', 'view'), (req, res) => {
  res.json({ message: 'Phase 2: Returns production jobs from BigQuery', user: req.user.email });
});

// Example: GET /api/users - requires 'full' on settings (admin only)
app.get('/api/users', requirePermission('settings', 'full'), (req, res) => {
  res.json({ message: 'Phase 2: Returns users from BigQuery', user: req.user.email });
});

app.listen(PORT, () => {
  console.log(`CRM Server running on http://localhost:${PORT}`);
});
