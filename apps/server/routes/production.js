'use strict'

const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

const VALID_STAGES = ['pre-press', 'printing', 'finishing', 'shipping', 'done']
const VALID_PRIORITIES = ['low', 'normal', 'high', 'urgent']

// GET /api/production/jobs — list all active jobs
router.get('/jobs', requirePermission('production', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0
    const stage = req.query.stage || ''
    const priority = req.query.priority || ''
    const params = { limit, offset }

    let whereClause = "WHERE stage != 'done'"
    if (stage) {
      whereClause += ' AND stage = @stage'
      params.stage = stage
    }
    if (priority) {
      whereClause += ' AND priority = @priority'
      params.priority = priority
    }

    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, job_type, quantity,
               paper_size, paper_type, finish, stage, priority,
               due_date, notes, created_by, created_at, updated_at
        FROM ${DS}.jobs
        ${whereClause}
        ORDER BY
          CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END,
          due_date ASC
        LIMIT @limit OFFSET @offset
      `,
      params,
    })
    res.json({ jobs: rows, limit, offset })
  } catch (err) {
    console.error('[production] GET /jobs error:', err.message)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// POST /api/production/jobs — create job
router.post('/jobs', requirePermission('production', 'edit'), async (req, res) => {
  const {
    client_id, client_name, title, job_type, quantity,
    paper_size, paper_type, finish, stage, priority, due_date, notes,
  } = req.body

  if (!client_id || !client_name || !title) {
    return res.status(400).json({ error: 'client_id, client_name, and title are required' })
  }
  if (stage && !VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: `stage must be one of: ${VALID_STAGES.join(', ')}` })
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }

  try {
    const now = new Date().toISOString()
    const row = {
      id: uuidv4(),
      client_id,
      client_name,
      title,
      job_type: job_type || null,
      quantity: quantity ? parseInt(quantity) : null,
      paper_size: paper_size || null,
      paper_type: paper_type || null,
      finish: finish || null,
      stage: stage || 'pre-press',
      priority: priority || 'normal',
      due_date: due_date || null,
      notes: notes || null,
      created_by: req.user.email,
      created_at: now,
      updated_at: now,
    }

    await bigquery.dataset(DATASET).table('jobs').insert([row])
    res.status(201).json({ job: row })
  } catch (err) {
    console.error('[production] POST /jobs error:', err.message)
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// GET /api/production/jobs/:id — get job detail
router.get('/jobs/:id', requirePermission('production', 'view'), async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, job_type, quantity,
               paper_size, paper_type, finish, stage, priority,
               due_date, notes, created_by, created_at, updated_at
        FROM ${DS}.jobs
        WHERE id = @id
        LIMIT 1
      `,
      params: { id },
    })

    if (!rows.length) {
      return res.status(404).json({ error: 'Job not found' })
    }
    res.json({ job: rows[0] })
  } catch (err) {
    console.error('[production] GET /jobs/:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch job' })
  }
})

// PATCH /api/production/jobs/:id/stage — update job stage
router.patch('/jobs/:id/stage', requirePermission('production', 'edit'), async (req, res) => {
  const { id } = req.params
  const { stage } = req.body

  if (!VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: `stage must be one of: ${VALID_STAGES.join(', ')}` })
  }

  try {
    await bigquery.query({
      query: `UPDATE ${DS}.jobs SET stage = @stage, updated_at = CURRENT_TIMESTAMP() WHERE id = @id`,
      params: { stage, id },
    })
    res.json({ message: 'Job stage updated' })
  } catch (err) {
    console.error('[production] PATCH /jobs/:id/stage error:', err.message)
    res.status(500).json({ error: 'Failed to update job stage' })
  }
})

// GET /api/production/history — completed jobs
router.get('/history', requirePermission('production', 'view'), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0

    const [rows] = await bigquery.query({
      query: `
        SELECT id, client_id, client_name, title, job_type, quantity,
               paper_size, paper_type, finish, stage, priority,
               due_date, notes, created_by, created_at, updated_at
        FROM ${DS}.jobs
        WHERE stage = 'done'
        ORDER BY updated_at DESC
        LIMIT @limit OFFSET @offset
      `,
      params: { limit, offset },
    })
    res.json({ jobs: rows, limit, offset })
  } catch (err) {
    console.error('[production] GET /history error:', err.message)
    res.status(500).json({ error: 'Failed to fetch production history' })
  }
})

module.exports = router
