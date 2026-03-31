'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

// GET /api/sales/leads — list leads (companies with prospect status)
router.get('/leads', requirePermission('sales', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0

    const [rows] = await bigquery.query({
      query: `
        SELECT id, name, industry, tier, website, phone, email,
               address, notes, status, created_at, updated_at
        FROM ${DS}.companies
        WHERE status = 'prospect'
        ORDER BY created_at DESC
        LIMIT @limit OFFSET @offset
      `,
      params: { limit, offset },
    })
    res.json({ leads: rows, limit, offset })
  } catch (err) {
    console.error('[sales] GET /leads error:', err.message)
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

// GET /api/sales/quotes — list all quotes
router.get('/quotes', requirePermission('sales', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0
    const status = req.query.status || ''
    const params = { limit, offset }

    let whereClause = 'WHERE 1=1'
    if (status) {
      whereClause += ' AND status = @status'
      params.status = status
    }

    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, status,
               valid_until, subtotal, vat, total, notes,
               created_by, created_at, updated_at
        FROM ${DS}.quotes
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT @limit OFFSET @offset
      `,
      params,
    })
    res.json({ quotes: rows, limit, offset })
  } catch (err) {
    console.error('[sales] GET /quotes error:', err.message)
    res.status(500).json({ error: 'Failed to fetch quotes' })
  }
})

// POST /api/sales/quotes — create quote with items
router.post('/quotes', requirePermission('sales', 'edit'), async (req, res) => {
  const { client_id, client_name, title, status, valid_until, notes, items } = req.body
  if (!client_id || !client_name || !title) {
    return res.status(400).json({ error: 'client_id, client_name, and title are required' })
  }

  try {
    const now = new Date().toISOString()
    const quoteId = uuidv4()

    // Calculate totals from items
    const quoteItems = (items || []).map((item) => ({
      id: uuidv4(),
      quote_id: quoteId,
      description: item.description,
      quantity: parseInt(item.quantity) || 0,
      unit_price: parseFloat(item.unit_price) || 0,
      total: (parseInt(item.quantity) || 0) * (parseFloat(item.unit_price) || 0),
    }))

    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0)
    const vat = parseFloat((subtotal * 0.07).toFixed(2))
    const total = parseFloat((subtotal + vat).toFixed(2))

    const quoteRow = {
      id: quoteId,
      client_id,
      client_name,
      title,
      status: status || 'draft',
      valid_until: valid_until || null,
      subtotal,
      vat,
      total,
      notes: notes || null,
      created_by: req.user.email,
      created_at: now,
      updated_at: now,
    }

    await bigquery.dataset(DATASET).table('quotes').insert([quoteRow])

    if (quoteItems.length) {
      await bigquery.dataset(DATASET).table('quote_items').insert(quoteItems)
    }

    res.status(201).json({ quote: quoteRow, items: quoteItems })
  } catch (err) {
    console.error('[sales] POST /quotes error:', err.message)
    res.status(500).json({ error: 'Failed to create quote' })
  }
})

// GET /api/sales/quotes/:id — get quote with items
router.get('/quotes/:id', requirePermission('sales', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [[quoteRows], [itemRows]] = await Promise.all([
      bigquery.query({
        query: `
          SELECT id, client_id, client_name, title, status,
                 valid_until, subtotal, vat, total, notes,
                 created_by, created_at, updated_at
          FROM ${DS}.quotes
          WHERE id = @id
          LIMIT 1
        `,
        params: { id },
      }),
      bigquery.query({
        query: `
          SELECT id, quote_id, description, quantity, unit_price, total
          FROM ${DS}.quote_items
          WHERE quote_id = @id
          ORDER BY ROWNUM
        `,
        params: { id },
      }),
    ])

    if (!quoteRows.length) {
      return res.status(404).json({ error: 'Quote not found' })
    }
    res.json({ quote: quoteRows[0], items: itemRows })
  } catch (err) {
    // Fallback: fetch quote alone if items query fails (e.g. ROWNUM not supported)
    try {
      const [quoteRows] = await bigquery.query({
        query: `
          SELECT id, client_id, client_name, title, status,
                 valid_until, subtotal, vat, total, notes,
                 created_by, created_at, updated_at
          FROM ${DS}.quotes WHERE id = @id LIMIT 1
        `,
        params: { id: req.params.id },
      })
      if (!quoteRows.length) return res.status(404).json({ error: 'Quote not found' })

      const [itemRows] = await bigquery.query({
        query: `SELECT id, quote_id, description, quantity, unit_price, total FROM ${DS}.quote_items WHERE quote_id = @id`,
        params: { id: req.params.id },
      })
      res.json({ quote: quoteRows[0], items: itemRows })
    } catch (err2) {
      console.error('[sales] GET /quotes/:id error:', err2.message)
      res.status(500).json({ error: 'Failed to fetch quote' })
    }
  }
})

// PATCH /api/sales/quotes/:id/status — update quote status
router.patch('/quotes/:id/status', requirePermission('sales', 'edit'), async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const validStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` })
  }

  try {
    await bigquery.query({
      query: `UPDATE ${DS}.quotes SET status = @status, updated_at = CURRENT_TIMESTAMP() WHERE id = @id`,
      params: { status, id },
    })
    res.json({ message: 'Quote status updated' })
  } catch (err) {
    console.error('[sales] PATCH /quotes/:id/status error:', err.message)
    res.status(500).json({ error: 'Failed to update quote status' })
  }
})

// GET /api/sales/deals — list deals (approved or rejected quotes)
router.get('/deals', requirePermission('sales', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0

    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, status,
               valid_until, subtotal, vat, total, notes,
               created_by, created_at, updated_at
        FROM ${DS}.quotes
        WHERE status IN ('approved', 'rejected')
        ORDER BY updated_at DESC
        LIMIT @limit OFFSET @offset
      `,
      params: { limit, offset },
    })
    res.json({ deals: rows, limit, offset })
  } catch (err) {
    console.error('[sales] GET /deals error:', err.message)
    res.status(500).json({ error: 'Failed to fetch deals' })
  }
})

module.exports = router
