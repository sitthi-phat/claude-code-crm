'use strict'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { loadSecrets } = require('./lib/secrets')
const { verifyToken } = require('./middleware/auth')

async function startServer() {
  // Load secrets from GCP Secret Manager when running in Cloud Run
  await loadSecrets()

  const app = express()
  const PORT = process.env.PORT || 8080

  // Security headers
  app.use(helmet())

  // CORS
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    })
  )

  app.use(express.json())

  // Rate limiting on all /api routes
  app.use(
    '/api/',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  )

  // Health check — no auth required
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', project: process.env.GCP_PROJECT_ID || 'gen-lang-client-0453424159' })
  })

  // Apply verifyToken to all /api routes EXCEPT /api/auth/verify
  app.use('/api', (_req, _res, next) => {
    if (_req.path === '/auth/verify') return next()
    verifyToken(_req, _res, next)
  })

  // Route handlers
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/users', require('./routes/users'))
  app.use('/api/roles', require('./routes/roles'))
  app.use('/api/clients', require('./routes/clients'))
  app.use('/api/contacts', require('./routes/contacts'))
  app.use('/api/sales', require('./routes/sales'))
  app.use('/api/production', require('./routes/production'))
  app.use('/api/inventory', require('./routes/inventory'))
  app.use('/api/analytics', require('./routes/analytics'))

  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Global error handler
  app.use((err, _req, res, _next) => {
    console.error('[server] Unhandled error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  })

  app.listen(PORT, () => {
    console.log(`MAllPrint CRM API running on port ${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
