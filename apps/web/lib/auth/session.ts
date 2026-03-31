import { AuthUser, MenuPermissions, Session } from './types'

// Session key in localStorage
const SESSION_KEY = 'crm_session'

// Calculate next 1 AM from now
function getNext1AM(): string {
  const now = new Date()
  const next1AM = new Date(now)
  next1AM.setHours(1, 0, 0, 0)
  if (now.getHours() >= 1) {
    next1AM.setDate(next1AM.getDate() + 1)
  }
  return next1AM.toISOString()
}

export function saveSession(user: AuthUser, permissions: MenuPermissions, idToken?: string): Session {
  const session: Session = {
    user,
    permissions,
    idToken,
    loginAt: new Date().toISOString(),
    expiresAt: getNext1AM(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  // Keep legacy key for AuthGuard compatibility
  localStorage.setItem('isLoggedIn', 'true')
  return session
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session: Session = JSON.parse(raw)
    // Check expiry
    if (new Date() > new Date(session.expiresAt)) {
      clearSession()
      return null
    }
    return session
  } catch { return null }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('isLoggedIn')
}

export function getCurrentUser(): AuthUser | null {
  return getSession()?.user ?? null
}

export function getAuthToken(): string | null {
  return getSession()?.idToken ?? null
}
