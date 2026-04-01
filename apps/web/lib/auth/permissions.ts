import { MenuPermissions } from './types'

export function canView(permissions: MenuPermissions, menu: keyof MenuPermissions): boolean {
  return permissions[menu] !== 'none'
}

export function canEdit(permissions: MenuPermissions, menu: keyof MenuPermissions): boolean {
  return permissions[menu] === 'edit' || permissions[menu] === 'delete'
}

export function canDelete(permissions: MenuPermissions, menu: keyof MenuPermissions): boolean {
  return permissions[menu] === 'delete'
}

// Phase 2: This will call the backend API to verify JWT + permissions
// export async function verifyWithBackend(token: string, action: string): Promise<boolean> {
//   const res = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
//   return res.ok
// }
