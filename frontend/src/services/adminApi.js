const API_BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'admin_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function fetchAdmin(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.status === 401) {
      removeToken()
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login'
      }
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || error.error || `HTTP ${response.status}`)
    }

    // Handle 204 No Content
    if (response.status === 204) return null

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

export const adminAuth = {
  login(email, password) {
    return fetchAdmin('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then((data) => {
      setToken(data.token)
      return data
    })
  },

  logout() {
    return fetchAdmin('/admin/logout', { method: 'POST' }).finally(() => {
      removeToken()
    })
  },

  getUser() {
    return fetchAdmin('/admin/user')
  },
}

export const adminDashboard = {
  getStats() {
    return fetchAdmin('/admin/dashboard')
  },
}

export const adminNews = {
  getAll(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return fetchAdmin(`/admin/news${qs ? `?${qs}` : ''}`)
  },

  getById(id) {
    return fetchAdmin(`/admin/news/${id}`)
  },

  create(data) {
    return fetchAdmin('/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update(id, data) {
    return fetchAdmin(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete(id) {
    return fetchAdmin(`/admin/news/${id}`, { method: 'DELETE' })
  },
}

export const adminProjects = {
  getAll(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return fetchAdmin(`/admin/projects${qs ? `?${qs}` : ''}`)
  },

  getById(id) {
    return fetchAdmin(`/admin/projects/${id}`)
  },

  accept(id) {
    return fetchAdmin(`/admin/projects/${id}/accept`, { method: 'POST' })
  },

  reject(id, reason) {
    return fetchAdmin(`/admin/projects/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejection_reason: reason }),
    })
  },
}

export const adminAudit = {
  getLogs(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return fetchAdmin(`/admin/audit-logs${qs ? `?${qs}` : ''}`)
  },

  getSummary() {
    return fetchAdmin('/admin/audit-logs/summary')
  },
}

export const adminChatStats = {
  getStats(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return fetchAdmin(`/admin/chat-stats${qs ? `?${qs}` : ''}`)
  },
}

export const adminHealth = {
  check() {
    return fetchAdmin('/admin/health')
  },
}

export const adminSecurity = {
  getLoginAttempts(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return fetchAdmin(`/admin/security/login-attempts${qs ? `?${qs}` : ''}`)
  },
}
