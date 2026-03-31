/**
 * BigQuery Table Setup Script
 * Creates all tables for MAllPrint CRM in the mallprint_crm dataset.
 * Seeds initial roles and admin user.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json node setup-bigquery.js
 */

'use strict'

const { BigQuery } = require('@google-cloud/bigquery')

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'gen-lang-client-0453424159'
const DATASET_ID = 'mallprint_crm'

const bigquery = new BigQuery({ projectId: PROJECT_ID })

// ---------------------------------------------------------------------------
// Table schemas
// ---------------------------------------------------------------------------

const tables = [
  {
    id: 'users',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'email', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'avatar', type: 'STRING', mode: 'NULLABLE' },
      { name: 'role_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'role_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'status', type: 'STRING', mode: 'REQUIRED' },       // 'active'|'pending'|'disabled'
      { name: 'login_method', type: 'STRING', mode: 'REQUIRED' }, // 'google'|'password'
      { name: 'last_login', type: 'TIMESTAMP', mode: 'NULLABLE' },
      { name: 'invited_by', type: 'STRING', mode: 'NULLABLE' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'roles',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'description', type: 'STRING', mode: 'NULLABLE' },
      { name: 'is_system', type: 'BOOL', mode: 'REQUIRED' },
      { name: 'perm_dashboard', type: 'STRING', mode: 'REQUIRED' },   // 'none'|'view'|'edit'|'full'
      { name: 'perm_clients', type: 'STRING', mode: 'REQUIRED' },
      { name: 'perm_sales', type: 'STRING', mode: 'REQUIRED' },
      { name: 'perm_production', type: 'STRING', mode: 'REQUIRED' },
      { name: 'perm_inventory', type: 'STRING', mode: 'REQUIRED' },
      { name: 'perm_automation', type: 'STRING', mode: 'REQUIRED' },
      { name: 'perm_settings', type: 'STRING', mode: 'REQUIRED' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'invitations',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'email', type: 'STRING', mode: 'REQUIRED' },
      { name: 'role_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'role_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'invited_by', type: 'STRING', mode: 'REQUIRED' },
      { name: 'invited_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'status', type: 'STRING', mode: 'REQUIRED' }, // 'pending'|'accepted'|'expired'
      { name: 'token', type: 'STRING', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'companies',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'industry', type: 'STRING', mode: 'NULLABLE' },
      { name: 'tier', type: 'STRING', mode: 'NULLABLE' },    // 'enterprise'|'mid-market'|'smb'
      { name: 'website', type: 'STRING', mode: 'NULLABLE' },
      { name: 'phone', type: 'STRING', mode: 'NULLABLE' },
      { name: 'email', type: 'STRING', mode: 'NULLABLE' },
      { name: 'address', type: 'STRING', mode: 'NULLABLE' },
      { name: 'tax_id', type: 'STRING', mode: 'NULLABLE' },
      { name: 'notes', type: 'STRING', mode: 'NULLABLE' },
      { name: 'status', type: 'STRING', mode: 'NULLABLE' },  // 'active'|'inactive'|'prospect'
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'contacts',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'company_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'first_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'last_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'email', type: 'STRING', mode: 'NULLABLE' },
      { name: 'phone', type: 'STRING', mode: 'NULLABLE' },
      { name: 'position', type: 'STRING', mode: 'NULLABLE' },
      { name: 'line_id', type: 'STRING', mode: 'NULLABLE' },
      { name: 'notes', type: 'STRING', mode: 'NULLABLE' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'quotes',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'client_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'client_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'title', type: 'STRING', mode: 'REQUIRED' },
      { name: 'status', type: 'STRING', mode: 'REQUIRED' }, // 'draft'|'sent'|'approved'|'rejected'|'expired'
      { name: 'valid_until', type: 'DATE', mode: 'NULLABLE' },
      { name: 'subtotal', type: 'FLOAT64', mode: 'NULLABLE' },
      { name: 'vat', type: 'FLOAT64', mode: 'NULLABLE' },
      { name: 'total', type: 'FLOAT64', mode: 'NULLABLE' },
      { name: 'notes', type: 'STRING', mode: 'NULLABLE' },
      { name: 'created_by', type: 'STRING', mode: 'REQUIRED' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'quote_items',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'quote_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'description', type: 'STRING', mode: 'REQUIRED' },
      { name: 'quantity', type: 'INT64', mode: 'REQUIRED' },
      { name: 'unit_price', type: 'FLOAT64', mode: 'REQUIRED' },
      { name: 'total', type: 'FLOAT64', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'jobs',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'client_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'client_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'title', type: 'STRING', mode: 'REQUIRED' },
      { name: 'job_type', type: 'STRING', mode: 'NULLABLE' },  // 'Brochure'|'Catalog'|etc
      { name: 'quantity', type: 'INT64', mode: 'NULLABLE' },
      { name: 'paper_size', type: 'STRING', mode: 'NULLABLE' },
      { name: 'paper_type', type: 'STRING', mode: 'NULLABLE' },
      { name: 'finish', type: 'STRING', mode: 'NULLABLE' },
      { name: 'stage', type: 'STRING', mode: 'REQUIRED' },    // 'pre-press'|'printing'|'finishing'|'shipping'|'done'
      { name: 'priority', type: 'STRING', mode: 'REQUIRED' }, // 'low'|'normal'|'high'|'urgent'
      { name: 'due_date', type: 'DATE', mode: 'NULLABLE' },
      { name: 'notes', type: 'STRING', mode: 'NULLABLE' },
      { name: 'created_by', type: 'STRING', mode: 'REQUIRED' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'materials',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'category', type: 'STRING', mode: 'REQUIRED' }, // 'Paper'|'Ink'|'Binding'|'Finishing'|'Packaging'
      { name: 'unit', type: 'STRING', mode: 'REQUIRED' },
      { name: 'current_stock', type: 'FLOAT64', mode: 'REQUIRED' },
      { name: 'min_stock', type: 'FLOAT64', mode: 'REQUIRED' },
      { name: 'unit_cost', type: 'FLOAT64', mode: 'REQUIRED' },
      { name: 'supplier_id', type: 'STRING', mode: 'NULLABLE' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'suppliers',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'contact_person', type: 'STRING', mode: 'NULLABLE' },
      { name: 'email', type: 'STRING', mode: 'NULLABLE' },
      { name: 'phone', type: 'STRING', mode: 'NULLABLE' },
      { name: 'lead_time_days', type: 'INT64', mode: 'NULLABLE' },
      { name: 'payment_terms', type: 'STRING', mode: 'NULLABLE' },
      { name: 'rating', type: 'FLOAT64', mode: 'NULLABLE' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'updated_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
  {
    id: 'activities',
    schema: [
      { name: 'id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'type', type: 'STRING', mode: 'REQUIRED' },        // 'quote'|'job'|'call'|'email'|'contact'
      { name: 'description', type: 'STRING', mode: 'REQUIRED' },
      { name: 'user_id', type: 'STRING', mode: 'REQUIRED' },
      { name: 'user_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'related_id', type: 'STRING', mode: 'NULLABLE' },
      { name: 'related_type', type: 'STRING', mode: 'NULLABLE' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const NOW = new Date().toISOString()

const SEED_ROLES = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system access',
    is_system: true,
    perm_dashboard: 'full',
    perm_clients: 'full',
    perm_sales: 'full',
    perm_production: 'full',
    perm_inventory: 'full',
    perm_automation: 'full',
    perm_settings: 'full',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Administrative access without system settings',
    is_system: true,
    perm_dashboard: 'full',
    perm_clients: 'full',
    perm_sales: 'full',
    perm_production: 'full',
    perm_inventory: 'full',
    perm_automation: 'full',
    perm_settings: 'edit',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'role-sales',
    name: 'Sales Manager',
    description: 'Manage clients, contacts and sales pipeline',
    is_system: false,
    perm_dashboard: 'view',
    perm_clients: 'full',
    perm_sales: 'full',
    perm_production: 'view',
    perm_inventory: 'view',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'role-production',
    name: 'Production Manager',
    description: 'Manage production jobs and inventory',
    is_system: false,
    perm_dashboard: 'view',
    perm_clients: 'view',
    perm_sales: 'view',
    perm_production: 'full',
    perm_inventory: 'full',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to all modules',
    is_system: false,
    perm_dashboard: 'view',
    perm_clients: 'view',
    perm_sales: 'view',
    perm_production: 'view',
    perm_inventory: 'view',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'role-finance',
    name: 'Finance',
    description: 'Access to sales and financial data',
    is_system: false,
    perm_dashboard: 'view',
    perm_clients: 'view',
    perm_sales: 'full',
    perm_production: 'view',
    perm_inventory: 'view',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: NOW,
    updated_at: NOW,
  },
]

const SEED_ADMIN_USER = {
  id: 'user-admin-josukekung',
  email: 'josukekung@gmail.com',
  name: 'Josuke Kung',
  avatar: null,
  role_id: 'role-super-admin',
  role_name: 'Super Admin',
  status: 'active',
  login_method: 'google',
  last_login: null,
  invited_by: null,
  created_at: NOW,
  updated_at: NOW,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function tableExists(dataset, tableId) {
  try {
    const [exists] = await dataset.table(tableId).exists()
    return exists
  } catch {
    return false
  }
}

async function createTable(dataset, tableConfig) {
  const { id, schema } = tableConfig
  if (await tableExists(dataset, id)) {
    console.log(`  [SKIP] Table '${id}' already exists.`)
    return
  }
  await dataset.createTable(id, { schema })
  console.log(`  [OK]   Table '${id}' created.`)
}

async function rowExists(query, params) {
  const [rows] = await bigquery.query({ query, params })
  return rows.length > 0
}

async function insertRow(tableRef, rows) {
  await tableRef.insert(rows)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nMAllPrint CRM — BigQuery Setup`)
  console.log(`Project : ${PROJECT_ID}`)
  console.log(`Dataset : ${DATASET_ID}\n`)

  // Ensure dataset exists
  const dataset = bigquery.dataset(DATASET_ID)
  const [dsExists] = await dataset.exists()
  if (!dsExists) {
    await bigquery.createDataset(DATASET_ID, { location: 'asia-east2' })
    console.log(`[OK]   Dataset '${DATASET_ID}' created.\n`)
  } else {
    console.log(`[SKIP] Dataset '${DATASET_ID}' already exists.\n`)
  }

  // Create tables
  console.log('Creating tables...')
  for (const tableConfig of tables) {
    await createTable(dataset, tableConfig)
  }

  // Seed roles
  console.log('\nSeeding roles...')
  for (const role of SEED_ROLES) {
    const exists = await rowExists(
      `SELECT id FROM \`${PROJECT_ID}.${DATASET_ID}.roles\` WHERE id = @id LIMIT 1`,
      { id: role.id }
    )
    if (exists) {
      console.log(`  [SKIP] Role '${role.name}' already seeded.`)
    } else {
      await insertRow(dataset.table('roles'), [role])
      console.log(`  [OK]   Role '${role.name}' inserted.`)
    }
  }

  // Seed admin user
  console.log('\nSeeding admin user...')
  const adminExists = await rowExists(
    `SELECT id FROM \`${PROJECT_ID}.${DATASET_ID}.users\` WHERE email = @email LIMIT 1`,
    { email: SEED_ADMIN_USER.email }
  )
  if (adminExists) {
    console.log(`  [SKIP] Admin user '${SEED_ADMIN_USER.email}' already seeded.`)
  } else {
    await insertRow(dataset.table('users'), [SEED_ADMIN_USER])
    console.log(`  [OK]   Admin user '${SEED_ADMIN_USER.email}' inserted.`)
  }

  console.log('\nSetup complete.\n')
}

main().catch((err) => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
