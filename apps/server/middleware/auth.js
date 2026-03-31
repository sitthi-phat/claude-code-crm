/**
 * JWT Authentication Middleware
 * Phase 1: Mock verification (always passes if header present)
 * Phase 2: Replace with GCP Identity Platform JWT verification
 *
 * GCP Architecture:
 * - Frontend sends: Authorization: Bearer <google-id-token>
 * - This middleware verifies token with Google's public keys
 * - Checks user exists in BigQuery users table
 * - Checks user is active and not disabled
 * - Attaches user + permissions to req.user
 */

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Phase 1: Mock verification - accept any non-empty token
    // Phase 2 replacement:
    // const ticket = await googleAuthClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID })
    // const payload = ticket.getPayload()
    // const user = await bigquery.query(`SELECT * FROM users WHERE email = '${payload.email}' AND status = 'active'`)

    if (token === 'mock-admin-token') {
      req.user = {
        id: 'u1',
        email: 'admin@company.com',
        role: 'super-admin',
        permissions: {
          dashboard: 'full',
          clients: 'full',
          sales: 'full',
          production: 'full',
          inventory: 'full',
          automation: 'full',
          settings: 'full',
        },
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' })
  }
}

const requirePermission = (menu, level = 'view') => (req, res, next) => {
  const levels = ['none', 'view', 'edit', 'full']
  const userLevel = req.user?.permissions?.[menu] ?? 'none'
  if (levels.indexOf(userLevel) >= levels.indexOf(level)) return next()
  return res.status(403).json({ error: `Forbidden: Requires '${level}' permission on '${menu}'` })
}

module.exports = { verifyToken, requirePermission }
