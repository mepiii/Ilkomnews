import { API_BASE } from './api'

// ponytail: httpOnly cookie auth — no localStorage token, credentials:'include' on all requests
// Implements retry with exponential backoff for 429 and network errors (max 3 retries)
export async function fetchAdmin(endpoint, options = {}, isFormData = false, retryOptions = {}) {
  const { maxRetries = 3, baseDelay = 600 } = retryOptions
  const headers = { ...options.headers }

  const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]
  if (xsrf) headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrf)

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (!headers['Accept']) {
    headers['Accept'] = 'application/json'
  }

  const attempt = async (n) => {
    const controller = new AbortController()
    // Honor caller-provided signal
    if (options.signal) {
      if (options.signal.aborted) controller.abort()
      options.signal.addEventListener('abort', () => controller.abort(), { once: true })
    }
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.status === 429 && n < maxRetries) {
        clearTimeout(timeoutId)
        const retryAfter = Number(response.headers.get('Retry-After')) * 1000
        const delay = retryAfter || baseDelay * Math.pow(2, n) + Math.random() * 200
        await new Promise(r => setTimeout(r, delay))
        return attempt(n + 1)
      }

      if (response.status === 401) {
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login'
        }
        throw new Error('Unauthorized')
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || error.error || `HTTP ${response.status}`)
      }

      if (response.status === 204) return null

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout', { cause: error })
      }
      // Retry on network errors if budget allows
      if (n < maxRetries && !options.signal?.aborted) {
        const delay = baseDelay * Math.pow(2, n) + Math.random() * 200
        await new Promise(r => setTimeout(r, delay))
        return attempt(n + 1)
      }
      throw error
    }
  }
  return attempt(0)
}

export const adminAuth = {
  async login(email, password, remember = false) {
    await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
    return fetchAdmin('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember }),
    })
  },

  logout() {
    return fetchAdmin('/admin/logout', { method: 'POST' })
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

  createWithForm(formData) {
    return fetchAdmin('/admin/news', {
      method: 'POST',
      body: formData,
    }, true)
  },

  update(id, data) {
    return fetchAdmin(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  updateWithForm(id, formData) {
    return fetchAdmin(`/admin/news/${id}`, {
      method: 'POST', // Use POST with _method=PUT in formData for Laravel
      body: formData,
    }, true)
  },

  delete(id) {
    return fetchAdmin(`/admin/news/${id}`, { method: 'DELETE' })
  },

  reorder: async (order) => {
    return fetchAdmin('/admin/news/reorder', { method: 'PUT', body: JSON.stringify({ order }) })
  },
  toggleHidden: async (id) => {
    return fetchAdmin(`/admin/news/${id}/toggle-hidden`, { method: 'PUT' })
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

export const adminChatbot = {
  getAll() {
    return fetchAdmin('/admin/chatbot-api')
  },

  getById(id) {
    return fetchAdmin(`/admin/chatbot-api/${id}`)
  },

  create(data) {
    return fetchAdmin('/admin/chatbot-api', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update(id, data) {
    return fetchAdmin(`/admin/chatbot-api/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete(id) {
    return fetchAdmin(`/admin/chatbot-api/${id}`, { method: 'DELETE' })
  },

  testConnection(data) {
    return fetchAdmin('/admin/chatbot-api/test', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export const adminSecurity = {
  getLoginAttempts(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return fetchAdmin(`/admin/security/login-attempts${qs ? `?${qs}` : ''}`)
  },
}

// Admin profile management
adminAuth.getProfile = function() {
  return fetchAdmin('/admin/profile')
}

adminAuth.updateProfile = function(data) {
  return fetchAdmin('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

adminAuth.updatePassword = function(data) {
  return fetchAdmin('/admin/profile/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Admin management API
export const adminFetch = async (endpoint, options = {}) => {
  return fetchAdmin(`/admin${endpoint}`, options)
}
