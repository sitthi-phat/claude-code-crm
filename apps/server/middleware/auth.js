'use strict'

const { OAuth2Client } = require('google-auth-library')
const { db } = require('../lib/firestore')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const email = payload.email

    // Look up user in Firestore (query by email only to avoid composite index requirement)
    const usersSnap = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()

    if (usersSnap.empty) {
      return res.status(401).json({ error: 'Unauthorized: User not found or inactive' })
    }

    const userDoc = usersSnap.docs[0]
    const userData = userDoc.data()

    if (userData.deleted) {
      return res.status(401).json({ error: 'Unauthorized: User not found or inactive' })
    }

    if (userData.status !== 'active') {
      return res.status(401).json({ error: 'Unauthorized: User not found or inactive' })
    }

    if (userData.force_logout) {
      return res.status(401).json({ error: 'Session invalidated', code: 'SESSION_INVALIDATED' })
    }
    const user = { id: userDoc.id, ...userData }

    // Get role permissions
    const roleDoc = await db.collection('roles').doc(user.role_id).get()
    const role = roleDoc.exists ? roleDoc.data() : {}

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      roleId: user.role_id,
      roleName: user.role_name,
      permissions: {
        dashboard: role.perm_dashboard || 'none',
        clients: role.perm_clients || 'none',
        sales: role.perm_sales || 'none',
        production: role.perm_production || 'none',
        inventory: role.perm_inventory || 'none',
        automation: role.perm_automation || 'none',
        settings: role.perm_settings || 'none',
      },
    }

    // Update last_login asynchronously
    userDoc.ref.update({ last_login: new Date(), updated_at: new Date() })
      .catch(err => console.error('[auth] Failed to update last_login:', err.message))

    next()
  } catch (err) {
    console.error('[auth] Token verification error:', err.message)
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}

const requirePermission = (menu, level = 'view') => (req, res, next) => {
  const levels = ['none', 'view', 'edit', 'delete']
  const userLevel = req.user?.permissions?.[menu] ?? 'none'
  if (levels.indexOf(userLevel) >= levels.indexOf(level)) return next()
  return res.status(403).json({ error: `Forbidden: Requires '${level}' permission on '${menu}'` })
}

module.exports = { verifyToken, requirePermission }
