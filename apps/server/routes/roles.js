'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { db } = require('../lib/firestore')
const { requirePermission } = require('../middleware/auth')

const router = Router()

const VALID_PERM_LEVELS = ['none', 'view', 'edit', 'full']
const PERM_FIELDS = [
  'perm_dashboard', 'perm_clients', 'perm_sales',
  'perm_production', 'perm_inventory', 'perm_automation', 'perm_settings',
]

// GET /api/roles — list all roles
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('roles').orderBy('created_at', 'asc').get()
    const roles = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json({ roles })
  } catch (err) {
    console.error('[roles] GET / error:', err.message)
    res.status(500).json({ error: 'Failed to fetch roles' })
  }
})

// POST /api/roles — create role (requires settings full)
router.post('/', requirePermission('settings', 'delete'), async (req, res) => {
  const { name, description, ...perms } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  for (const field of PERM_FIELDS) {
    const val = perms[field] || 'none'
    if (!VALID_PERM_LEVELS.includes(val)) {
      return res.status(400).json({ error: `Invalid value for ${field}: '${val}'` })
    }
  }

  try {
    const id = uuidv4()
    const now = new Date()
    const roleData = {
      name,
      description: description || null,
      is_system: false,
      perm_dashboard: perms.perm_dashboard || 'none',
      perm_clients: perms.perm_clients || 'none',
      perm_sales: perms.perm_sales || 'none',
      perm_production: perms.perm_production || 'none',
      perm_inventory: perms.perm_inventory || 'none',
      perm_automation: perms.perm_automation || 'none',
      perm_settings: perms.perm_settings || 'none',
      created_at: now,
      updated_at: now,
    }

    await db.collection('roles').doc(id).set(roleData)
    res.status(201).json({ role: { id, ...roleData } })
  } catch (err) {
    console.error('[roles] POST / error:', err.message)
    res.status(500).json({ error: 'Failed to create role' })
  }
})

// PUT /api/roles/:id — update role (requires settings full)
router.put('/:id', requirePermission('settings', 'delete'), async (req, res) => {
  const { id } = req.params
  const { name, description, ...perms } = req.body

  for (const field of PERM_FIELDS) {
    if (perms[field] !== undefined && !VALID_PERM_LEVELS.includes(perms[field])) {
      return res.status(400).json({ error: `Invalid value for ${field}: '${perms[field]}'` })
    }
  }

  try {
    const updates = { updated_at: new Date() }
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    for (const field of PERM_FIELDS) {
      if (perms[field] !== undefined) updates[field] = perms[field]
    }

    await db.collection('roles').doc(id).update(updates)
    res.json({ message: 'Role updated' })
  } catch (err) {
    console.error('[roles] PUT /:id error:', err.message)
    res.status(500).json({ error: 'Failed to update role' })
  }
})

// DELETE /api/roles/:id — delete non-system role (requires settings full)
router.delete('/:id', requirePermission('settings', 'delete'), async (req, res) => {
  const { id } = req.params

  try {
    const roleDoc = await db.collection('roles').doc(id).get()

    if (!roleDoc.exists) {
      return res.status(404).json({ error: 'Role not found' })
    }
    if (roleDoc.data().is_system) {
      return res.status(400).json({ error: 'Cannot delete a system role' })
    }

    await db.collection('roles').doc(id).delete()
    res.json({ message: 'Role deleted' })
  } catch (err) {
    console.error('[roles] DELETE /:id error:', err.message)
    res.status(500).json({ error: 'Failed to delete role' })
  }
})

module.exports = router
