"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthUser, MenuPermissions } from './types'
import { getSession, clearSession, saveSession } from './session'
import { mockRoles, mockUsers } from '@/lib/mock-data/users'

type AuthContextType = {
  user: AuthUser | null
  permissions: MenuPermissions | null
  isLoading: boolean
  loginWithGoogle: (email: string) => Promise<boolean>  // mock
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
      const role = mockRoles.find(r => r.id === session.user.roleId)
      if (role) setPermissions(role.permissions)
    }
    setIsLoading(false)
  }, [])

  const loginWithGoogle = async (email: string): Promise<boolean> => {
    // Phase 2: replace with real Google OAuth + GCP Identity Platform
    await new Promise(r => setTimeout(r, 800))
    const mockUser = mockUsers.find(u => u.email === email && u.loginMethod === 'google' && u.status === 'active')
    if (!mockUser) return false
    const role = mockRoles.find(r => r.id === mockUser.roleId)
    if (!role) return false
    saveSession(mockUser)
    setUser(mockUser)
    setPermissions(role.permissions)
    return true
  }

  const loginWithPassword = async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600))
    if (email === 'admin@company.com' && password === 'admin1234') {
      const adminUser = mockUsers.find(u => u.email === 'admin@company.com')
      if (!adminUser) return false
      const role = mockRoles.find(r => r.id === adminUser.roleId)
      if (!role) return false
      saveSession(adminUser)
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
