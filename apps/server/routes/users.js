'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../lib/firestore')
const { requirePermission } = require('../middleware/auth')
const { sendInvitationEmail } = require('../lib/mailer')

const router = Router()

// GET /api/users — list all users (requires settings view)
router.get('/', requirePermission('settings', 'view'), async (req, res) => {
  try {
    const snap = await db.collection('users').orderBy('created_at', 'desc').get()
    const users = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json({ users })
  } catch (err) {
    console.error('[users] GET /users error:', err.message)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/users/invitations — list all invitations (requires settings view)
router.get('/invitations', requirePermission('settings', 'view'), async (req, res) => {
  try {
    const snap = await db.collection('invitations').orderBy('invited_at', 'desc').get()
    const invitations = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json({ invitations })
  } catch (err) {
    console.error('[users] GET /invitations error:', err.message)
    res.status(500).json({ error: 'Failed to fetch invitations' })
  }
})

// POST /api/users/invite — create invitation (requires settings edit)
router.post('/invite', requirePermission('settings', 'edit'), async (req, res) => {
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

// POST /api/users/invitations/:id/resend — resend invitation email (requires settings edit)
router.post('/invitations/:id/resend', requirePermission('settings', 'edit'), async (req, res) => {
  try {
    const invDoc = await db.collection('invitations').doc(req.params.id).get()
    if (!invDoc.exists) return res.status(404).json({ error: 'Invitation not found' })

    const inv = invDoc.data()
    if (inv.status !== 'pending') return res.status(400).json({ error: 'Invitation is no longer pending' })

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const appUrl = process.env.APP_URL || 'http://localhost:3000'
      await sendInvitationEmail({
        to: inv.email,
        invitedBy: req.user.email,
        roleName: inv.role_name,
        appUrl,
      })
    }

    res.json({ message: 'Invitation resent' })
  } catch (err) {
    console.error('[users] POST /invitations/:id/resend error:', err.message)
    res.status(500).json({ error: 'Failed to resend invitation' })
  }
})

// PATCH /api/users/invitations/:id/cancel — cancel invitation (requires settings delete)
router.patch('/invitations/:id/cancel', requirePermission('settings', 'delete'), async (req, res) => {
  try {
    await db.collection('invitations').doc(req.params.id).update({ status: 'expired' })
    res.json({ message: 'Invitation cancelled' })
  } catch (err) {
    console.error('[users] PATCH /invitations/:id/cancel error:', err.message)
    res.status(500).json({ error: 'Failed to cancel invitation' })
  }
})

// PATCH /api/users/:id/status — enable or disable a user (requires settings edit)
router.patch('/:id/status', requirePermission('settings', 'edit'), async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['active', 'disabled'].includes(status)) {
    return res.status(400).json({ error: "status must be 'active' or 'disabled'" })
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

// DELETE /api/users/:id — soft-delete user (requires settings delete)
router.delete('/:id', requirePermission('settings', 'delete'), async (req, res) => {
  const { id } = req.params

  if (id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' })
  }

  try {
    // Soft-delete: set deleted flag + force logout, keep document
    await db.collection('users').doc(id).update({
      deleted: true,
      status: 'disabled',
      force_logout: true,
      updated_at: new Date(),
    })
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error('[users] DELETE /:id error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
