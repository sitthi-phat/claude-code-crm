"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthUser, MenuPermissions } from './types'
import { getSession, clearSession, saveSession } from './session'
import { mockRoles, mockUsers } from '@/lib/mock-data/users'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type AuthContextType = {
  user: AuthUser | null
  permissions: MenuPermissions | null
  isLoading: boolean
  loginWithGoogle: (idToken: string) => Promise<boolean>
  loginWithPassword: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<MenuPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session.user)
      setPermissions(session.permissions)
    }
    setIsLoading(false)
  }, [])

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      })
      if (!res.ok) return false
      const { user: userData } = await res.json()

      const authUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar || userData.name?.charAt(0) || '?',
        roleId: userData.roleId,
        roleName: userData.roleName,
        status: 'active',
        loginMethod: 'google',
        lastLogin: null,
        invitedBy: null,
        createdAt: new Date().toISOString(),
      }

      saveSession(authUser, userData.permissions, idToken)
      setUser(authUser)
      setPermissions(userData.permissions)
      return true
    } catch (err) {
      console.error('[loginWithGoogle]', err)
      return false
    }
  }

  const loginWithPassword = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600))
    if (email === 'admin@company.com' && password === 'admin1234') {
      const adminUser = mockUsers.find(u => u.email === 'admin@company.com')
      if (!adminUser) return false
      const role = mockRoles.find(r => r.id === adminUser.roleId)
      if (!role) return false
      saveSession(adminUser, role.permissions)
      setUser(adminUser)
      setPermissions(role.permissions)
      return true
    }
    return false
  }

  const logout = () => {
    clearSession()
    setUser(null)
    setPermissions(null)
  }

  return (
    <AuthContext.Provider value={{ user, permissions, isLoading, loginWithGoogle, loginWithPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
