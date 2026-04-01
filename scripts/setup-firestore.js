'use strict'

/**
 * setup-firestore.js
 * Seeds Firestore with 6 default roles and the initial admin user.
 * Run once: node scripts/setup-firestore.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../apps/server/.env') })

const { Firestore } = require('@google-cloud/firestore')

const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'gen-lang-client-0453424159',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

const now = new Date()

const roles = [
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Full system access',
    is_system: true,
    perm_dashboard: 'full',
    perm_clients: 'full',
    perm_sales: 'full',
    perm_production: 'full',
    perm_inventory: 'full',
    perm_automation: 'full',
    perm_settings: 'full',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'role-manager',
    name: 'Manager',
    description: 'Can view and edit most modules',
    is_system: true,
    perm_dashboard: 'full',
    perm_clients: 'full',
    perm_sales: 'full',
    perm_production: 'full',
    perm_inventory: 'edit',
    perm_automation: 'view',
    perm_settings: 'view',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'role-sales',
    name: 'Sales',
    description: 'Clients and sales access',
    is_system: true,
    perm_dashboard: 'view',
    perm_clients: 'full',
    perm_sales: 'full',
    perm_production: 'view',
    perm_inventory: 'view',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'role-production',
    name: 'Production',
    description: 'Production and inventory access',
    is_system: true,
    perm_dashboard: 'view',
    perm_clients: 'view',
    perm_sales: 'view',
    perm_production: 'full',
    perm_inventory: 'full',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'role-accounting',
    name: 'Accounting',
    description: 'Sales and reporting view',
    is_system: true,
    perm_dashboard: 'view',
    perm_clients: 'view',
    perm_sales: 'view',
    perm_production: 'none',
    perm_inventory: 'none',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to dashboard',
    is_system: true,
    perm_dashboard: 'view',
    perm_clients: 'none',
    perm_sales: 'none',
    perm_production: 'none',
    perm_inventory: 'none',
    perm_automation: 'none',
    perm_settings: 'none',
    created_at: now,
    updated_at: now,
  },
]

const adminUser = {
  id: 'user-admin',
  email: 'josukekung@gmail.com',
  name: 'Admin',
  avatar: 'A',
  role_id: 'role-admin',
  role_name: 'Admin',
  status: 'active',
  login_method: 'google',
  last_login: now,
  invited_by: null,
  created_at: now,
  updated_at: now,
}

async function seed() {
  console.log('Seeding Firestore...')

  const batch = db.batch()

  for (const role of roles) {
    const { id, ...data } = role
    batch.set(db.collection('roles').doc(id), data)
    console.log(`  queued role: ${role.name}`)
  }

  const { id: userId, ...userData } = adminUser
  batch.set(db.collection('users').doc(userId), userData)
  console.log(`  queued user: ${adminUser.email}`)

  await batch.commit()
  console.log('Done.')
}

seed().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
