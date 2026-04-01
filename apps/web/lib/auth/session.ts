import { AuthUser, MenuPermissions, Session } from './types'

// Session key in localStorage
const SESSION_KEY = 'crm_session'

// Calculate next 1 AM Thailand time (UTC+7)
function getNext1AM(): string {
  const TZ_OFFSET_MS = 7 * 60 * 60 * 1000 // UTC+7
  const nowUtc = Date.now()
  const nowThai = nowUtc + TZ_OFFSET_MS

  // Current time broken down in Thai timezone
  const thaiDate = new Date(nowThai)
  const thaiHour = thaiDate.getUTCHours()

  // Next 1 AM Thai = today 1 AM Thai if hour < 1, else tomorrow 1 AM Thai
  const next1AmThai = new Date(nowThai)
  next1AmThai.setUTCHours(1, 0, 0, 0)
  if (thaiHour >= 1) {
    next1AmThai.setUTCDate(next1AmThai.getUTCDate() + 1)
  }

  // Convert back to UTC
  return new Date(next1AmThai.getTime() - TZ_OFFSET_MS).toISOString()
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
