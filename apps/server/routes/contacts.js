'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

// GET /api/contacts — list all contacts (requires clients view)
router.get('/', requirePermission('clients', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0
    const search = req.query.search || ''
    const params = { limit, offset }

    let whereClause = 'WHERE 1=1'
    if (search) {
      whereClause += ' AND (LOWER(first_name) LIKE LOWER(@search) OR LOWER(last_name) LIKE LOWER(@search) OR LOWER(email) LIKE LOWER(@search))'
      params.search = `%${search}%`
    }

    const query = `
      SELECT c.id, c.company_id, c.first_name, c.last_name, c.email, c.phone,
             c.position, c.line_id, c.notes, c.created_at, c.updated_at,
             co.name AS company_name
      FROM ${DS}.contacts c
      LEFT JOIN ${DS}.companies co ON c.company_id = co.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT @limit OFFSET @offset
    `
    const [rows] = await bigquery.query({ query, params })
    res.json({ contacts: rows, limit, offset })
  } catch (err) {
    console.error('[contacts] GET / error:', err.message)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// POST /api/contacts — create contact (requires clients edit)
router.post('/', requirePermission('clients', 'edit'), async (req, res) => {
  const { company_id, first_name, last_name, email, phone, position, line_id, notes } = req.body
  if (!company_id || !first_name || !last_name) {
    return res.status(400).json({ error: 'company_id, first_name, and last_name are required' })
  }

  try {
    const now = new Date().toISOString()
    const row = {
      id: uuidv4(),
      company_id,
      first_name,
      last_name,
      email: email || null,
      phone: phone || null,
      position: position || null,
      line_id: line_id || null,
      notes: notes || null,
      created_at: now,
      updated_at: now,
    }

    await bigquery.dataset(DATASET).table('contacts').insert([row])
    res.status(201).json({ contact: row })
  } catch (err) {
    console.error('[contacts] POST / error:', err.message)
    res.status(500).json({ error: 'Failed to create contact' })
  }
})

// GET /api/contacts/:id — get contact (requires clients view)
router.get('/:id', requirePermission('clients', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT c.id, c.company_id, c.first_name, c.last_name, c.email, c.phone,
               c.position, c.line_id, c.notes, c.created_at, c.updated_at,
               co.name AS company_name
        FROM ${DS}.contacts c
        LEFT JOIN ${DS}.companies co ON c.company_id = co.id
        WHERE c.id = @id
        LIMIT 1
      `,
      params: { id },
    })

    if (!rows.length) {
      return res.status(404).json({ error: 'Contact not found' })
    }
    res.json({ contact: rows[0] })
  } catch (err) {
    console.error('[contacts] GET /:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch contact' })
  }
})

// PUT /api/contacts/:id — update contact (requires clients edit)
router.put('/:id', requirePermission('clients', 'edit'), async (req, res) => {
  const { id } = req.params
  const fields = ['company_id', 'first_name', 'last_name', 'email', 'phone', 'position', 'line_id', 'notes']
  const setClauses = []
  const params = { id }

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      setClauses.push(`${field} = @${field}`)
      params[field] = req.body[field]
    }
  }

  if (!setClauses.length) {
    return res.status(400).json({ error: 'No fields to update' })
  }

  setClauses.push('updated_at = CURRENT_TIMESTAMP()')

  try {
    await bigquery.query({
      query: `UPDATE ${DS}.contacts SET ${setClauses.join(', ')} WHERE id = @id`,
      params,
    })
    res.json({ message: 'Contact updated' })
  } catch (err) {
    console.error('[contacts] PUT /:id error:', err.message)
    res.status(500).json({ error: 'Failed to update contact' })
  }
})

module.exports = router
