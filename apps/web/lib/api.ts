import { getAuthToken, clearSession } from './auth/session'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    },
  })

  if (res.status === 401) {
    clearSession()
    window.location.href = '/login'
  }

  return res
}
