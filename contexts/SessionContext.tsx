'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ADMIN_NAME } from '@/lib/constants'

interface SessionContextType {
  user: string | null
  isAdmin: boolean
  loading: boolean
  setUser: (name: string) => void
  clearUser: () => void
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: () => {},
  clearUser: () => {},
})

const STORAGE_KEY = 'homebase-user'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setUserState(stored)
    setLoading(false)
  }, [])

  const setUser = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name)
    setUserState(name)
  }

  const clearUser = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUserState(null)
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isAdmin: user === ADMIN_NAME,
        loading,
        setUser,
        clearUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
