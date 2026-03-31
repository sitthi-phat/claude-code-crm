'use strict'

const { Router } = require('express')
const { bigquery, PROJECT_ID } = require('../lib/bigquery')
const { requirePermission } = require('../middleware/auth')

const router = Router()
const DATASET = process.env.BQ_DATASET || 'mallprint_crm'
const DS = `\`${PROJECT_ID}.${DATASET}\``

// GET /api/analytics/dashboard — KPI data
router.get('/dashboard', requirePermission('dashboard', 'view'), async (req, res) => {
  try {
    const [
      [activeJobsRows],
      [revenuePipelineRows],
      [pendingApprovalsRows],
      [inventoryAlertsRows],
      [recentActivityRows],
    ] = await Promise.all([
      // Active jobs count (not done)
      bigquery.query({
        query: `SELECT COUNT(*) AS count FROM ${DS}.jobs WHERE stage != 'done'`,
      }),
      // Revenue pipeline (sum of totals for non-rejected/non-expired quotes)
      bigquery.query({
        query: `
          SELECT
            COALESCE(SUM(CASE WHEN status = 'approved' THEN total ELSE 0 END), 0) AS won,
            COALESCE(SUM(CASE WHEN status IN ('draft', 'sent') THEN total ELSE 0 END), 0) AS pipeline
          FROM ${DS}.quotes
          WHERE status NOT IN ('rejected', 'expired')
        `,
      }),
      // Pending quote approvals
      bigquery.query({
        query: `SELECT COUNT(*) AS count FROM ${DS}.quotes WHERE status = 'sent'`,
      }),
      // Inventory alerts (materials at or below min stock)
      bigquery.query({
        query: `SELECT COUNT(*) AS count FROM ${DS}.materials WHERE current_stock <= min_stock`,
      }),
      // Recent activity (last 10 entries)
      bigquery.query({
        query: `
          SELECT id, type, description, user_id, user_name,
                 related_id, related_type, created_at
          FROM ${DS}.activities
          ORDER BY created_at DESC
          LIMIT 10
        `,
      }),
    ])

    res.json({
      kpis: {
        active_jobs: Number(activeJobsRows[0]?.count ?? 0),
        revenue_won: Number(revenuePipelineRows[0]?.won ?? 0),
        revenue_pipeline: Number(revenuePipelineRows[0]?.pipeline ?? 0),
        pending_approvals: Number(pendingApprovalsRows[0]?.count ?? 0),
        inventory_alerts: Number(inventoryAlertsRows[0]?.count ?? 0),
      },
      recent_activity: recentActivityRows,
    })
  } catch (err) {
    console.error('[analytics] GET /dashboard error:', err.message)
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

// GET /api/analytics/revenue — monthly revenue chart data (last 12 months)
router.get('/revenue', requirePermission('dashboard', 'view'), async (req, res) => {
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT
          FORMAT_DATE('%Y-%m', DATE(created_at)) AS month,
          COALESCE(SUM(CASE WHEN status = 'approved' THEN total ELSE 0 END), 0) AS revenue,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) AS deals_won,
          COUNT(*) AS total_quotes
        FROM ${DS}.quotes
        WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)
        GROUP BY month
        ORDER BY month ASC
      `,
    })
    res.json({ revenue: rows })
  } catch (err) {
    console.error('[analytics] GET /revenue error:', err.message)
    res.status(500).json({ error: 'Failed to fetch revenue data' })
  }
})

module.exports = router
