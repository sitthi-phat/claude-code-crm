'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

// GET /api/users — list all users (requires settings full)
router.get('/', requirePermission('settings', 'full'), async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.email, u.name, u.avatar, u.role_id, u.role_name,
             u.status, u.login_method, u.last_login, u.invited_by,
             u.created_at, u.updated_at
      FROM ${DS}.users u
      ORDER BY u.created_at DESC
    `
    const [rows] = await bigquery.query({ query })
    res.json({ users: rows })
  } catch (err) {
    console.error('[users] GET /users error:', err.message)
    res.status(500).json({ error: 'Failed to fetch users' })
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
    const now = new Date().toISOString()

    const row = {
      id,
      email,
      role_id,
      role_name,
      invited_by: req.user.email,
      invited_at: now,
      status: 'pending',
      token,
    }

    await bigquery.dataset(DATASET).table('invitations').insert([row])
    res.status(201).json({ invitation: row })
  } catch (err) {
    console.error('[users] POST /invite error:', err.message)
    res.status(500).json({ error: 'Failed to create invitation' })
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
    const query = `
      UPDATE ${DS}.users
      SET status = @status, updated_at = CURRENT_TIMESTAMP()
      WHERE id = @id
    `
    await bigquery.query({ query, params: { status, id } })
    res.json({ message: 'User status updated' })
  } catch (err) {
    console.error('[users] PATCH /:id/status error:', err.message)
    res.status(500).json({ error: 'Failed to update user status' })
  }
})

// DELETE /api/users/:id — delete user (requires settings full)
router.delete('/:id', requirePermission('settings', 'full'), async (req, res) => {
  const { id } = req.params

  // Prevent self-deletion
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' })
  }

  try {
    const query = `DELETE FROM ${DS}.users WHERE id = @id`
    await bigquery.query({ query, params: { id } })
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error('[users] DELETE /:id error:', err.message)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

module.exports = router
