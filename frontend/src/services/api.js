// Konfigurasi API
// ponytail: single source of truth for API base URL — all consumers import from here
export const API_BASE = import.meta.env.VITE_API_URL || '/api'

const API_CONFIG = {
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Helper untuk fetch dengan error handling
// Implements:
//  - hard timeout (10s)
//  - automatic retry on 429 with exponential backoff (max 3 retries)
//  - honour Retry-After header from the server
//  - AbortController signal support so callers can cancel
export const fetchAPI = async (endpoint, options = {}, retryOptions = {}) => {
  const { maxRetries = 3, baseDelay = 600 } = retryOptions
  const controller = new AbortController()
  // Honor caller-provided signal
  if (options.signal) {
    if (options.signal.aborted) controller.abort()
    options.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  const attempt = async (n) => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          ...API_CONFIG.headers,
          ...options.headers,
        }
      })

      if (response.status === 429 && n < maxRetries) {
        const retryAfter = Number(response.headers.get('Retry-After')) * 1000
        const delay = retryAfter || baseDelay * Math.pow(2, n) + Math.random() * 200
        clearTimeout(timeoutId)
        await new Promise(r => setTimeout(r, delay))
        return attempt(n + 1)
      }

      clearTimeout(timeoutId)
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        // A caller-initiated abort (e.g. React StrictMode double-invoke in dev,
        // or component unmount) is NOT a timeout. Re-throw the AbortError so
        // callers can keep ignoring it via `err.name === 'AbortError'`. Only
        // raise the misleading "Request timeout" when OUR internal timer fired
        // (i.e. the caller's signal was not the source of the abort).
        if (options.signal?.aborted) throw error
        throw new Error('Request timeout', { cause: error })
      }
      // Only retry genuine network failures (fetch rejected before producing a
      // response). Processed HTTP 4xx/5xx status errors thrown above must not be
      // retried, otherwise every error triggers redundant server round-trips.
      if (n < maxRetries && !options.signal?.aborted && error.name === 'TypeError') {
        const delay = baseDelay * Math.pow(2, n) + Math.random() * 200
        await new Promise(r => setTimeout(r, delay))
        return attempt(n + 1)
      }
      throw error
    }
  }
  return attempt(0)
}

// ============ RESPONSE NORMALIZERS ============

// Normalize a news list response into a plain array, regardless of whether the
// server returned a flat array or a Laravel paginator envelope ({ data: [...] }).
export const normalizeNewsList = (res) => (Array.isArray(res) ? res : (res?.data ?? []))

// ============ API SERVICES ============

// News Service
export const newsService = {
  // Get all news — always normalized to a plain array
  getAll: async (options = {}) => {
    return normalizeNewsList(await fetchAPI('/news', options))
  },

  // Get latest news — always normalized to a plain array
  getLatest: async (limit = 5, options = {}) => {
    return normalizeNewsList(await fetchAPI(`/news/latest?limit=${limit}`, options))
  },

  // Get news by ID
  getById: async (id) => {
    return fetchAPI(`/news/${id}`)
  },

  // Search news
  search: async (query, filters = {}) => {
    const queryString = new URLSearchParams({ q: query, ...filters }).toString()
    return fetchAPI(`/news/search?${queryString}`)
  },

  // Get categories
  getCategories: async () => {
    return fetchAPI('/news/categories')
  }
}

// Articles Service
export const articlesService = {
  getAll: async () => {
    return fetchAPI('/articles')
  },

  getLatest: async (limit = 5) => {
    return fetchAPI(`/articles/latest?limit=${limit}`)
  },

  getById: async (id) => {
    return fetchAPI(`/articles/${id}`)
  },

  filterByCategory: async (category) => {
    return fetchAPI(`/articles/category/${category}`)
  },

  getCategories: async () => {
    return fetchAPI('/articles/categories')
  }
}

// Careers Service
export const careersService = {
  getAll: async () => {
    return fetchAPI('/careers')
  },

  getById: async (id) => {
    return fetchAPI(`/careers/${id}`)
  },

  apply: async (jobId, application) => {
    return fetchAPI(`/careers/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(application)
    })
  },

  getTypes: async () => {
    return fetchAPI('/careers/types')
  },

  getLocations: async () => {
    return fetchAPI('/careers/locations')
  }
}

// Public Projects Service (accepted only)
export const projectsService = {
  getAll: async (params = {}, options = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return fetchAPI(`/projects${queryString ? `?${queryString}` : ''}`, options)
  },

  getById: async (id) => {
    return fetchAPI(`/projects/${id}`)
  },

  getCategories: async () => {
    return Promise.resolve(['web', 'mobile', 'uiux', 'game', 'ai'])
  },
}

// Export all services
export const api = {
  news: newsService,
  articles: articlesService,
  careers: careersService,
  projects: projectsService,
}

// ============ VIEW TRACKING ============
// MySQL-backed view counter via API
export const viewTracker = {
  increment: async (type, id, baseViews = 0, { signal } = {}) => {
    try {
      const data = await fetchAPI(`/interactions/${type}/${id}/view`, {
        method: 'POST',
        credentials: 'include',
        ...(signal ? { signal } : {})
      })
      return data.views ?? baseViews + 1
    } catch (err) {
      // View tracking is non-critical; fall back to client-side count
      if (import.meta.env.DEV) console.warn(`View tracking failed for ${type}/${id}:`, err.message)
      return baseViews + 1
    }
  },
  get: async (type, id, baseViews = 0) => {
    try {
      const data = await fetchAPI(`/views/${type}/${id}`)
      return data.views || baseViews
    } catch (err) {
      if (import.meta.env.DEV) console.warn(`View count fetch failed for ${type}/${id}:`, err.message)
      return baseViews
    }
  }
}
