/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { adminAuth, setOnUnauthorized } from '../services/adminApi'
import { ADMIN_LOGIN_PATH } from '../config/admin'

// Export the context so it can be imported directly
// Default value prevents crash when lazy-loaded children render before provider mounts
export const AdminAuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
})

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(user)

  // Register the 401 handler so any Unauthorized response clears the user
  // WITHOUT a hard reload. This breaks the login <-> dashboard redirect loop
  // caused by a stale truthy user surviving a failed authenticated request.
  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null)
      setLoading(false)
    })
    return () => setOnUnauthorized(null)
  }, [])

  useEffect(() => {
    // Try to get user from session cookie (httpOnly)
    adminAuth.getUser()
      .then((data) => setUser(data.user || data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password, remember = false) => {
    const data = await adminAuth.login(email, password, remember)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminAuth.logout()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AdminAuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_LOGIN_PATH} state={{ from: location }} replace />
  }

  return children
}
