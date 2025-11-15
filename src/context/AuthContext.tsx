"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'

type Role = 'Bishop' | 'AssistingOverseer' | 'AreaPastor' | 'DataClerk'

type AuthState = {
  user: { id: string; email?: string } | null
  role: Role | null
  zones: string[]
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthState['user']>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [zones, setZones] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabaseBrowser.auth.getSession()
      const sess = sessionData?.session || null
      if (sess?.user) {
        setUser({ id: sess.user.id, email: sess.user.email ?? undefined })
        const { data: userRows } = await supabaseBrowser.from('users').select('role').eq('id', sess.user.id).limit(1)
        const r = (userRows && userRows[0]?.role) as Role | null
        setRole(r ?? null)
        const { data: uz } = await supabaseBrowser.from('user_zones').select('zone_id').eq('user_id', sess.user.id)
        setZones((uz ?? []).map((z: any) => z.zone_id))
      } else {
        setUser(null)
        setRole(null)
        setZones([])
      }
      setLoading(false)
    }
    init()
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async () => {
      setLoading(true)
      await init()
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabaseBrowser.auth.signOut()
    setUser(null)
    setRole(null)
    setZones([])
  }

  const value = useMemo<AuthState>(() => ({ user, role, zones, loading, logout }), [user, role, zones, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}