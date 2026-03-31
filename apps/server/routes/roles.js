'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

const VALID_PERM_LEVELS = ['none', 'view', 'edit', 'full']
const PERM_FIELDS = [
  'perm_dashboard', 'perm_clients', 'perm_sales',
  'perm_production', 'perm_inventory', 'perm_automation', 'perm_settings',
]

// GET /api/roles — list all roles
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, description, is_system,
             perm_dashboard, perm_clients, perm_sales,
             perm_production, perm_inventory, perm_automation, perm_settings,
             created_at, updated_at
      FROM ${DS}.roles
      ORDER BY created_at ASC
    `
    const [rows] = await bigquery.query({ query })
    res.json({ roles: rows })
  } catch (err) {
    console.error('[roles] GET / error:', err.message)
    res.status(500).json({ error: 'Failed to fetch roles' })
  }
})

// POST /api/roles — create role (requires settings full)
router.post('/', requirePermission('settings', 'full'), async (req, res) => {
  const { name, description, ...perms } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  // Validate permission values
  for (const field of PERM_FIELDS) {
    const val = perms[field] || 'none'
    if (!VALID_PERM_LEVELS.includes(val)) {
      return res.status(400).json({ error: `Invalid value for ${field}: '${val}'` })
    }
  }

  try {
    const now = new Date().toISOString()
    const row = {
      id: uuidv4(),
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

    await bigquery.dataset(DATASET).table('roles').insert([row])
    res.status(201).json({ role: row })
  } catch (err) {
    console.error('[roles] POST / error:', err.message)
    res.status(500).json({ error: 'Failed to create role' })
  }
})

// PUT /api/roles/:id — update role permissions (requires settings full)
router.put('/:id', requirePermission('settings', 'full'), async (req, res) => {
  const { id } = req.params
  const { name, description, ...perms } = req.body

  // Validate permission values
  for (const field of PERM_FIELDS) {
    if (perms[field] !== undefined && !VALID_PERM_LEVELS.includes(perms[field])) {
      return res.status(400).json({ error: `Invalid value for ${field}: '${perms[field]}'` })
    }
  }

  try {
    const setClauses = []
    const params = { id }

    if (name !== undefined) { setClauses.push('name = @name'); params.name = name }
    if (description !== undefined) { setClauses.push('description = @description'); params.description = description }
    for (const field of PERM_FIELDS) {
      if (perms[field] !== undefined) {
        setClauses.push(`${field} = @${field}`)
        params[field] = perms[field]
      }
    }
    setClauses.push('updated_at = CURRENT_TIMESTAMP()')

    const query = `UPDATE ${DS}.roles SET ${setClauses.join(', ')} WHERE id = @id`
    await bigquery.query({ query, params })
    res.json({ message: 'Role updated' })
  } catch (err) {
    console.error('[roles] PUT /:id error:', err.message)
    res.status(500).json({ error: 'Failed to update role' })
  }
})

// DELETE /api/roles/:id — delete non-system role (requires settings full)
router.delete('/:id', requirePermission('settings', 'full'), async (req, res) => {
  const { id } = req.params

  try {
    // Check if it's a system role
    const [rows] = await bigquery.query({
      query: `SELECT is_system FROM ${DS}.roles WHERE id = @id LIMIT 1`,
      params: { id },
    })

    if (!rows.length) {
      return res.status(404).json({ error: 'Role not found' })
    }
    if (rows[0].is_system) {
      return res.status(400).json({ error: 'Cannot delete a system role' })
    }

    await bigquery.query({
      query: `DELETE FROM ${DS}.roles WHERE id = @id`,
      params: { id },
    })
    res.json({ message: 'Role deleted' })
  } catch (err) {
    console.error('[roles] DELETE /:id error:', err.message)
    res.status(500).json({ error: 'Failed to delete role' })
  }
})

module.exports = router
