'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

const VALID_CATEGORIES = ['Paper', 'Ink', 'Binding', 'Finishing', 'Packaging']

// GET /api/inventory/materials — list materials
router.get('/materials', requirePermission('inventory', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0
    const category = req.query.category || ''
    const lowStock = req.query.low_stock === 'true'
    const params = { limit, offset }

    let whereClause = 'WHERE 1=1'
    if (category) {
      whereClause += ' AND category = @category'
      params.category = category
    }
    if (lowStock) {
      whereClause += ' AND current_stock <= min_stock'
    }

    const [rows] = await bigquery.query({
      query: `
        SELECT id, name, category, unit, current_stock, min_stock, unit_cost,
               supplier_id, created_at, updated_at
        FROM ${DS}.materials
        ${whereClause}
        ORDER BY category ASC, name ASC
        LIMIT @limit OFFSET @offset
      `,
      params,
    })
    res.json({ materials: rows, limit, offset })
  } catch (err) {
    console.error('[inventory] GET /materials error:', err.message)
    res.status(500).json({ error: 'Failed to fetch materials' })
  }
})

// POST /api/inventory/materials — add material
router.post('/materials', requirePermission('inventory', 'edit'), async (req, res) => {
  const { name, category, unit, current_stock, min_stock, unit_cost, supplier_id } = req.body
  if (!name || !category || !unit) {
    return res.status(400).json({ error: 'name, category, and unit are required' })
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` })
  }

  try {
    const now = new Date().toISOString()
    const row = {
      id: uuidv4(),
      name,
      category,
      unit,
      current_stock: parseFloat(current_stock) || 0,
      min_stock: parseFloat(min_stock) || 0,
      unit_cost: parseFloat(unit_cost) || 0,
      supplier_id: supplier_id || null,
      created_at: now,
      updated_at: now,
    }

    await bigquery.dataset(DATASET).table('materials').insert([row])
    res.status(201).json({ material: row })
  } catch (err) {
    console.error('[inventory] POST /materials error:', err.message)
    res.status(500).json({ error: 'Failed to create material' })
  }
})

// PUT /api/inventory/materials/:id — update material
router.put('/materials/:id', requirePermission('inventory', 'edit'), async (req, res) => {
  const { id } = req.params
  const fields = ['name', 'category', 'unit', 'current_stock', 'min_stock', 'unit_cost', 'supplier_id']
  const setClauses = []
  const params = { id }

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      setClauses.push(`${field} = @${field}`)
      params[field] = req.body[field]
    }
  }

  if (req.body.category && !VALID_CATEGORIES.includes(req.body.category)) {
    return res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` })
  }

  if (!setClauses.length) {
    return res.status(400).json({ error: 'No fields to update' })
  }

  setClauses.push('updated_at = CURRENT_TIMESTAMP()')

  try {
    await bigquery.query({
      query: `UPDATE ${DS}.materials SET ${setClauses.join(', ')} WHERE id = @id`,
      params,
    })
    res.json({ message: 'Material updated' })
  } catch (err) {
    console.error('[inventory] PUT /materials/:id error:', err.message)
    res.status(500).json({ error: 'Failed to update material' })
  }
})

// GET /api/inventory/suppliers — list suppliers
router.get('/suppliers', requirePermission('inventory', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0

    const [rows] = await bigquery.query({
      query: `
        SELECT id, name, contact_person, email, phone,
               lead_time_days, payment_terms, rating, created_at, updated_at
        FROM ${DS}.suppliers
        ORDER BY name ASC
        LIMIT @limit OFFSET @offset
      `,
      params: { limit, offset },
    })
    res.json({ suppliers: rows, limit, offset })
  } catch (err) {
    console.error('[inventory] GET /suppliers error:', err.message)
    res.status(500).json({ error: 'Failed to fetch suppliers' })
  }
})

// POST /api/inventory/suppliers — add supplier
router.post('/suppliers', requirePermission('inventory', 'edit'), async (req, res) => {
  const { name, contact_person, email, phone, lead_time_days, payment_terms, rating } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  try {
    const now = new Date().toISOString()
    const row = {
      id: uuidv4(),
      name,
      contact_person: contact_person || null,
      email: email || null,
      phone: phone || null,
      lead_time_days: lead_time_days ? parseInt(lead_time_days) : null,
      payment_terms: payment_terms || null,
      rating: rating ? parseFloat(rating) : null,
      created_at: now,
      updated_at: now,
    }

    await bigquery.dataset(DATASET).table('suppliers').insert([row])
    res.status(201).json({ supplier: row })
  } catch (err) {
    console.error('[inventory] POST /suppliers error:', err.message)
    res.status(500).json({ error: 'Failed to create supplier' })
  }
})

module.exports = router
