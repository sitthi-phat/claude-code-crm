'use strict'

const { Router } = require('express')
const { OAuth2Client } = require('google-auth-library')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../lib/firestore')

const router = Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({ user: req.user })
})

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const { token } = req.body
  if (!token) {
    return res.status(400).json({ error: 'token is required' })
  }

  let payload
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    payload = ticket.getPayload()
    console.log('[auth/verify] Token OK, email:', payload.email)
  } catch (err) {
    console.error('[auth/verify] Token verification failed:', err.message)
    console.error('[auth/verify] GOOGLE_CLIENT_ID set?', !!process.env.GOOGLE_CLIENT_ID)
    return res.status(401).json({ error: 'Invalid token' })
  }

  try {
    const email = payload.email

    // Look up user in Firestore (query by email only to avoid composite index requirement)
    console.log('[auth/verify] Looking up user:', email)
    const usersSnap = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()
    console.log('[auth/verify] Users found:', usersSnap.size)

    if (!usersSnap.empty) {
      const userDoc = usersSnap.docs[0]
      const user = { id: userDoc.id, ...userDoc.data() }

      if (user.status !== 'active') {
        return res.status(401).json({ error: 'User not found or inactive' })
      }

      // Get role permissions
      const roleDoc = await db.collection('roles').doc(user.role_id).get()
      const role = roleDoc.exists ? roleDoc.data() : {}

      // Update last_login and clear any force_logout flag
      userDoc.ref.update({ last_login: new Date(), updated_at: new Date(), force_logout: false })
        .catch(err => console.error('[auth/verify] Failed to update last_login:', err.message))

      return res.json({
        user: {
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
        },
      })
    }

    // User not found — check for pending invitation (query by email only)
    const invSnap = await db.collection('invitations')
      .where('email', '==', email)
      .limit(1)
      .get()

    console.log('[auth/verify] Invitations found for', email, ':', invSnap.size)
    if (!invSnap.empty) {
      console.log('[auth/verify] Invitation status:', invSnap.docs[0].data().status)
    }

    const pendingInv = invSnap.docs.find(d => d.data().status === 'pending')
    if (!pendingInv) {
      return res.status(401).json({ error: 'User not found or inactive' })
    }

    const invDoc = pendingInv
    const inv = invDoc.data()

    // Create user from invitation
    const newUserId = uuidv4()
    const name = payload.name || email.split('@')[0]
    const avatar = (payload.given_name || name).charAt(0).toUpperCase()
    const now = new Date()

    await db.collection('users').doc(newUserId).set({
      email,
      name,
      avatar,
      role_id: inv.role_id,
      role_name: inv.role_name,
      status: 'active',
      login_method: 'google',
      last_login: now,
      invited_by: inv.invited_by || null,
      created_at: now,
      updated_at: now,
    })

    // Mark invitation accepted (non-blocking)
    invDoc.ref.update({ status: 'accepted' })
      .catch(err => console.error('[auth/verify] Failed to update invitation:', err.message))

    // Get role permissions
    const roleDoc = await db.collection('roles').doc(inv.role_id).get()
    const role = roleDoc.exists ? roleDoc.data() : {}

    return res.json({
      user: {
        id: newUserId,
        email,
        name,
        avatar,
        roleId: inv.role_id,
        roleName: inv.role_name,
        permissions: {
          dashboard: role.perm_dashboard || 'none',
          clients: role.perm_clients || 'none',
          sales: role.perm_sales || 'none',
          production: role.perm_production || 'none',
          inventory: role.perm_inventory || 'none',
          automation: role.perm_automation || 'none',
          settings: role.perm_settings || 'none',
        },
      },
    })
  } catch (err) {
    console.error('[auth/verify] Firestore error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
