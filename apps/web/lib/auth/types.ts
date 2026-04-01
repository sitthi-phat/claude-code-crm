export type PermissionLevel = 'none' | 'view' | 'edit' | 'delete'

export type MenuPermissions = {
  dashboard: PermissionLevel
  clients: PermissionLevel
  sales: PermissionLevel
  production: PermissionLevel
  inventory: PermissionLevel
  automation: PermissionLevel
  settings: PermissionLevel  // only 'full' = can manage users/roles
}

export type Role = {
  id: string
  name: string
  description: string
  permissions: MenuPermissions
  isSystem: boolean  // system roles cannot be deleted
  createdAt: string
}

export type UserStatus = 'active' | 'pending' | 'disabled' | 'deleted'

export type AuthUser = {
  id: string
  email: string
  name: string
  avatar: string  // initials
  roleId: string
  roleName: string
  status: UserStatus
  loginMethod: 'google' | 'password'
  lastLogin: string | null
  invitedBy: string | null
  createdAt: string
}

export type Invitation = {
  id: string
  email: string
  roleId: string
  roleName: string
  invitedBy: string
  invitedAt: string
  status: 'pending' | 'accepted' | 'expired'
  token: string  // mock token
}

export type Session = {
  user: AuthUser
  permissions: MenuPermissions
  idToken?: string  // Google ID token for API calls
  loginAt: string   // ISO string
  expiresAt: string // 1 AM next occurrence
}
