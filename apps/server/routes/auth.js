'use strict'

const { Router } = require('express')
const { OAuth2Client } = require('google-auth-library')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// GET /api/auth/me
// Returns the already-verified user (req.user populated by verifyToken middleware).
router.get('/me', (req, res) => {
  res.json({ user: req.user })
})

// POST /api/auth/verify
// Verifies a Google ID token and returns user info.
// Called by the frontend on app load — NOT protected by verifyToken middleware.
router.post('/verify', async (req, res) => {
  const { token } = req.body
  if (!token) {
    return res.status(400).json({ error: 'token is required' })
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const email = payload.email

    const query = `
      SELECT u.id, u.email, u.name, u.avatar, u.role_id, u.role_name, u.status,
             r.perm_dashboard, r.perm_clients, r.perm_sales,
             r.perm_production, r.perm_inventory, r.perm_automation, r.perm_settings
      FROM \`${PROJECT_ID}.${DATASET}.users\` u
      JOIN \`${PROJECT_ID}.${DATASET}.roles\` r ON u.role_id = r.id
      WHERE u.email = @email AND u.status = 'active'
      LIMIT 1
    `
    const [rows] = await bigquery.query({ query, params: { email } })

    if (!rows.length) {
      return res.status(401).json({ error: 'User not found or inactive' })
    }

    const user = rows[0]
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      roleId: user.role_id,
      roleName: user.role_name,
      permissions: {
        dashboard: user.perm_dashboard,
        clients: user.perm_clients,
        sales: user.perm_sales,
        production: user.perm_production,
        inventory: user.perm_inventory,
        automation: user.perm_automation,
        settings: user.perm_settings,
      },
    }

    // Update last_login asynchronously
    bigquery
      .query({
        query: `UPDATE \`${PROJECT_ID}.${DATASET}.users\`
                SET last_login = CURRENT_TIMESTAMP(), updated_at = CURRENT_TIMESTAMP()
                WHERE email = @email`,
        params: { email },
      })
      .catch((err) => console.error('[auth/verify] Failed to update last_login:', err.message))

    res.json({ user: userData })
  } catch (err) {
    console.error('[auth/verify] Error:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router
