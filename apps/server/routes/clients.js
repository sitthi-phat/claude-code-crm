'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

// GET /api/clients — list companies with pagination (requires clients view)
router.get('/', requirePermission('clients', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0
    const search = req.query.search || ''
    const status = req.query.status || ''

    let whereClause = 'WHERE 1=1'
    const params = { limit, offset }

    if (search) {
      whereClause += ' AND LOWER(name) LIKE LOWER(@search)'
      params.search = `%${search}%`
    }
    if (status) {
      whereClause += ' AND status = @status'
      params.status = status
    }

    const query = `
      SELECT id, name, industry, tier, website, phone, email,
             address, tax_id, notes, status, created_at, updated_at
      FROM ${DS}.companies
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT @limit OFFSET @offset
    `
    const [rows] = await bigquery.query({ query, params })
    res.json({ clients: rows, limit, offset })
  } catch (err) {
    console.error('[clients] GET / error:', err.message)
    res.status(500).json({ error: 'Failed to fetch clients' })
  }
})

// POST /api/clients — create company (requires clients edit)
router.post('/', requirePermission('clients', 'edit'), async (req, res) => {
  const { name, industry, tier, website, phone, email, address, tax_id, notes, status } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  try {
    const now = new Date().toISOString()
    const row = {
      id: uuidv4(),
      name,
      industry: industry || null,
      tier: tier || null,
      website: website || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      tax_id: tax_id || null,
      notes: notes || null,
      status: status || 'active',
      created_at: now,
      updated_at: now,
    }

    await bigquery.dataset(DATASET).table('companies').insert([row])
    res.status(201).json({ client: row })
  } catch (err) {
    console.error('[clients] POST / error:', err.message)
    res.status(500).json({ error: 'Failed to create client' })
  }
})

// GET /api/clients/:id — get company detail (requires clients view)
router.get('/:id', requirePermission('clients', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT id, name, industry, tier, website, phone, email,
               address, tax_id, notes, status, created_at, updated_at
        FROM ${DS}.companies
        WHERE id = @id
        LIMIT 1
      `,
      params: { id },
    })

    if (!rows.length) {
      return res.status(404).json({ error: 'Client not found' })
    }
    res.json({ client: rows[0] })
  } catch (err) {
    console.error('[clients] GET /:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch client' })
  }
})

// PUT /api/clients/:id — update company (requires clients edit)
router.put('/:id', requirePermission('clients', 'edit'), async (req, res) => {
  const { id } = req.params
  const fields = ['name', 'industry', 'tier', 'website', 'phone', 'email', 'address', 'tax_id', 'notes', 'status']
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
      query: `UPDATE ${DS}.companies SET ${setClauses.join(', ')} WHERE id = @id`,
      params,
    })
    res.json({ message: 'Client updated' })
  } catch (err) {
    console.error('[clients] PUT /:id error:', err.message)
    res.status(500).json({ error: 'Failed to update client' })
  }
})

// GET /api/clients/:id/contacts — contacts for company (requires clients view)
router.get('/:id/contacts', requirePermission('clients', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT id, company_id, first_name, last_name, email, phone,
               position, line_id, notes, created_at, updated_at
        FROM ${DS}.contacts
        WHERE company_id = @id
        ORDER BY created_at DESC
      `,
      params: { id },
    })
    res.json({ contacts: rows })
  } catch (err) {
    console.error('[clients] GET /:id/contacts error:', err.message)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// GET /api/clients/:id/quotes — quotes for company (requires clients view)
router.get('/:id/quotes', requirePermission('clients', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, status,
               valid_until, subtotal, vat, total, notes,
               created_by, created_at, updated_at
        FROM ${DS}.quotes
        WHERE client_id = @id
        ORDER BY created_at DESC
      `,
      params: { id },
    })
    res.json({ quotes: rows })
  } catch (err) {
    console.error('[clients] GET /:id/quotes error:', err.message)
    res.status(500).json({ error: 'Failed to fetch quotes' })
  }
})

// GET /api/clients/:id/jobs — jobs for company (requires clients view)
router.get('/:id/jobs', requirePermission('clients', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, job_type, quantity,
               paper_size, paper_type, finish, stage, priority,
               due_date, notes, created_by, created_at, updated_at
        FROM ${DS}.jobs
        WHERE client_id = @id
        ORDER BY created_at DESC
      `,
      params: { id },
    })
    res.json({ jobs: rows })
  } catch (err) {
    console.error('[clients] GET /:id/jobs error:', err.message)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

module.exports = router
