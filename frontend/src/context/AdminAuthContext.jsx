import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { adminAuth } from '../services/adminApi'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(token && user)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    adminAuth.getUser()
      .then((data) => setUser(data.user || data))
      .catch(() => {
        localStorage.removeItem('admin_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = useCallback(async (email, password) => {
    const data = await adminAuth.login(email, password)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminAuth.logout()
    } finally {
      localStorage.removeItem('admin_token')
      setToken(null)
      setUser(null)
    }
  }, [])

  return (
    <AdminAuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
