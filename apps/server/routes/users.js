'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../lib/firestore')
const { requirePermission } = require('../middleware/auth')
const { sendInvitationEmail } = require('../lib/mailer')

const router = Router()

// GET /api/users — list all users (requires settings full)
router.get('/', requirePermission('settings', 'full'), async (req, res) => {
  try {
    const snap = await db.collection('users').orderBy('created_at', 'desc').get()
    const users = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json({ users })
  } catch (err) {
    console.error('[users] GET /users error:', err.message)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/users/invitations — list all invitations
router.get('/invitations', requirePermission('settings', 'full'), async (req, res) => {
  try {
    const snap = await db.collection('invitations').orderBy('invited_at', 'desc').get()
    const invitations = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json({ invitations })
  } catch (err) {
    console.error('[users] GET /invitations error:', err.message)
    res.status(500).json({ error: 'Failed to fetch invitations' })
  }
})

// POST /api/users/invite — create invitation record (requires settings full)
router.post('/invite', requirePermission('settings', 'full'), async (req, res) => {
  const { email, role_id, role_name } = req.body
  if (!email || !role_id || !role_name) {
    return res.status(400).json({ error: 'email, role_id, and role_name are required' })
  }

  try {
    const id = uuidv4()
    const token = uuidv4()
    const now = new Date()

    const invData = {
      email,
      role_id,
      role_name,
      invited_by: req.user.email,
      invited_at: now,
      status: 'pending',
      token,
    }

    await db.collection('invitations').doc(id).set(invData)

    // Send invitation email (non-blocking)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const appUrl = process.env.APP_URL || 'http://localhost:3000'
      sendInvitationEmail({
        to: email,
        invitedBy: req.user.email,
        roleName: role_name,
        appUrl,
      }).catch(err => console.error('[invite] Failed to send email:', err.message))
    } else {
      console.warn('[invite] Email not sent: GMAIL_USER or GMAIL_APP_PASSWORD not set')
    }

    res.status(201).json({ invitation: { id, ...invData } })
  } catch (err) {
    console.error('[users] POST /invite error:', err.message)
    res.status(500).json({ error: 'Failed to create invitation' })
  }
})

// PATCH /api/users/invitations/:id/cancel — cancel a pending invitation
router.patch('/invitations/:id/cancel', requirePermission('settings', 'full'), async (req, res) => {
  try {
    await db.collection('invitations').doc(req.params.id).update({ status: 'expired' })
    res.json({ message: 'Invitation cancelled' })
  } catch (err) {
    console.error('[users] PATCH /invitations/:id/cancel error:', err.message)
    res.status(500).json({ error: 'Failed to cancel invitation' })
  }
})

// PATCH /api/users/:id/status — enable or disable a user (requires settings full)
router.patch('/:id/status', requirePermission('settings', 'full'), async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['active', 'disabled', 'pending'].includes(status)) {
    return res.status(400).json({ error: "status must be 'active', 'disabled', or 'pending'" })
  }

  try {
    await db.collection('users').doc(id).update({ status, updated_at: new Date() })
    res.json({ message: 'User status updated' })
  } catch (err) {
    console.error('[users] PATCH /:id/status error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/users/:id/role — update user role (requires settings edit)
router.patch('/:id/role', requirePermission('settings', 'edit'), async (req, res) => {
  const { id } = req.params
  const { role_id, role_name } = req.body
  if (!role_id || !role_name) {
    return res.status(400).json({ error: 'role_id and role_name are required' })
  }
  try {
    await db.collection('users').doc(id).update({ role_id, role_name, force_logout: true, updated_at: new Date() })
    res.json({ message: 'User role updated' })
  } catch (err) {
    console.error('[users] PATCH /:id/role error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/users/:id — delete user (requires settings full)
router.delete('/:id', requirePermission('settings', 'full'), async (req, res) => {
  const { id } = req.params

  if (id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' })
  }

  try {
    await db.collection('users').doc(id).delete()
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error('[users] DELETE /:id error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
